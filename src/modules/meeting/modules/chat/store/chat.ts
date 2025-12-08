import { ref, watch, inject, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useChatWebSocket } from '../composables/useChatWebSocket.ts';
import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth';
import { PortalFilesAPI } from '../../chat/api/portalFiles';
import type { AuthData, ChatWebSocket } from '../types/chat';
import { WebsocketPayloadType } from '../enums/WebsocketPayloadType';
import { WebsocketMessageType } from '../enums/WebsocketMessageType';
import { generateProtoType, generateMessage } from '../scripts/generateProto';
import { useSafeChatMessaging } from '../composables/useSafeChatMessaging';

// Відкриті питання
// чи треба статус завантаження кожного файлу?
// якщо коннект розірвано - треба якийсь лоадер намалювати?
// формат messages не співпадає з воркспейсом, треба підігнати

export const useChatStore = defineStore('chat', () => {
	const config = inject<AppConfig>('$config')!;
	const messages = ref([]); // дописати тип   // дописати тип
	const controller: ChatWebSocket = ref(null);

	//
	const authStore = useAuthStore();
	const { accessToken, xPortalDevice } = storeToRefs(authStore);

	const authData = computed((): AuthData => {
		return {
			'X-Portal-Access': accessToken.value,
			'X-Portal-Device': xPortalDevice.value,
			'X-Portal-Client': config!.token.appToken,
		};
	});

	const lastMessage = computed(() => messages.value.at(-1) || null);

	function connect() {
		controller.value = useChatWebSocket({
			url: config.chat.host, // wss://dev.webitel.com/portal/ws
			authData: authData.value,
		});

		controller.value.open();
	}

	// TODO - прибрати в кінці
	// https://github.com/webitel/web-meeting/pull/11#discussion_r2598189230
	watch(
		accessToken,
		(token) => {
			if (token && !controller.value) {
				connect();
			}
		},
		{
			immediate: true,
		},
	);

	const { dispatchMessage, sendPendingMessages } = useSafeChatMessaging(
		(payload) => {
			if (!controller.value?.isConnected.value) return false;
			return controller.value.sendMessage(payload);
		},
	);

	watch(
		() => controller.value.isConnected.value,
		(value) => {
			if (value) {
				sendPendingMessages();
				if (lastMessage.value) reloadHistory();
			}
		},
	);

	// відправка текстового повідомлення

	function sendTextMessage(text: string = '') {
		const message = generateMessage(WebsocketPayloadType.SendMessage, {
			text,
		});
		dispatchMessage(message);
	}

	// завантаження файлу

	async function uploadFile(file: File, retry = 3): Promise<string> {
		try {
			const { uploadId } = await PortalFilesAPI.post({
				params: {
					mimeType: file.type || 'application/octet-stream',
					name: file.name,
				},
				headers: authData.value,
			});

			const { fileId } = await PortalFilesAPI.put({
				file,
				uploadId: uploadId,
				headers: authData.value,
			});

			return fileId;
		} catch (e) {
			if (retry > 0) return uploadFile(file, retry - 1);
			throw e;
		}
	}

	// відправка кожного файлу окремо

	async function sendFiles(files: File[]) {
		const uploadedIds = await Promise.all(
			files.map((file) => uploadFile(file)),
		);

		const message = generateMessage(WebsocketPayloadType.SendMessage, {
			file: uploadedIds,
		});
		dispatchMessage(message);
	}

	// дозавантаження історії повідомлень
	// вивантажуємо не всю історію, а нові повідомлення від offset останнього збереженного на нашій стороні

	function reloadHistory() {
		const message = generateMessage(WebsocketPayloadType.ChatUpdates, {
			offset: lastMessage.value?.id,
		});
		dispatchMessage(message);
	}

	// відключення вебсокета

	function disconnect() {
		controller.value.closeConnection();
		controller.value = null;
	}

	// обробка вхідних повідомлень

	controller.value.onMessage((wsMessage) => {
		const rootType = wsMessage.data?.['@type'];

		if (
			rootType === generateProtoType(WebsocketMessageType.Response) &&
			wsMessage.data?.data?.['@type'] ===
				generateProtoType(WebsocketMessageType.UpdateNewMessage)
		) {
			messages.value.push(wsMessage.data.data);
		}

		if (
			rootType === generateProtoType(WebsocketMessageType.UpdateNewMessage) &&
			wsMessage.data?.dispo === 'Incoming'
		) {
			messages.value.push(wsMessage.data);
		}
	});

	return {
		messages,

		connect,
		disconnect,
		sendTextMessage,
		sendFiles,
	};
});
