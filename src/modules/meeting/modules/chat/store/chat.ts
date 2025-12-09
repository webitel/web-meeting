import { ref, watch, inject, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useChatWebSocket } from '../composables/useChatWebSocket.ts';
import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth';
import { PortalFilesAPI } from '../../chat/api/portalFiles';
import type { AuthData } from '../types/chat';
import { WebsocketPayloadType } from '../enums/WebsocketPayloadType';
import { WebsocketMessageType } from '../enums/WebsocketMessageType';
import { generateProtoType, generateMessage } from '../scripts/generateMessage';
import { useSafeChatMessaging } from '../composables/useSafeChatMessaging';

// Відкриті питання
// чи треба статус завантаження кожного файлу?
// якщо коннект розірвано - треба якийсь лоадер намалювати?
// формат messages не співпадає з воркспейсом, треба підігнати

export const useChatStore = defineStore('chat', () => {
	const config = inject<AppConfig>('$config')!;
	const messages = ref([]); // дописати тип   // дописати тип

	const authStore = useAuthStore();
	const { accessToken, xPortalDevice } = storeToRefs(authStore);

	const authData = computed<AuthData>(() => ({
		'X-Portal-Access': accessToken.value,
		'X-Portal-Device': xPortalDevice.value,
		'X-Portal-Client': config!.token.appToken,
	}));

	const controller = useChatWebSocket(config.chat.host);

	const lastMessage = computed(() => messages.value.at(-1) || null);

	function connect() {
		controller.open(authData.value);
		subscribeIncomingMessage();
	}

	// TODO - прибрати в кінці
	// https://github.com/webitel/web-meeting/pull/11#discussion_r2598189230
	watch(
		accessToken,
		(token) => {
			if (token) {
				connect();
			}
		},
		{
			immediate: true,
		},
	);

	const { dispatchMessage, sendPendingMessages } = useSafeChatMessaging({
		sendMethod: (payload) => {
			return controller.sendMessage(payload);
		},
	});

	watch(
		() => controller?.isConnected.value,
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
		controller.closeConnection();
		controller = null;
	}

	// обробка вхідних повідомлень
	// TODO - порефакторити в кінці
	function subscribeIncomingMessage() {
		controller.onMessage((wsMessage) => {
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
	}

	return {
		messages,

		connect,
		disconnect,
		sendTextMessage,
		sendFiles,
	};
});
