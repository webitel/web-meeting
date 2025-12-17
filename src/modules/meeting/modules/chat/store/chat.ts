import { ref, watch, inject, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import type { ChatMessageType as UiChatMessageType } from '@webitel/ui-chats/ui';
import { useChatWebSocket } from '../composables/useChatWebSocket.ts';
import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth';
import { PortalFilesAPI } from '../../chat/api/portalFiles';
import type { AuthData, ChatWebSocketApi } from '../types/chat';
import { WebsocketPayloadType } from '../enums/WebsocketPayloadType';
import { WebsocketMessageType } from '../enums/WebsocketMessageType';
import {
	generateProtoType,
	generateMessage,
	generateHistoryMessage,
} from '../scripts/generateMessage';
import { useSafeChatMessaging } from '../composables/useSafeChatMessaging';

export const useChatStore = defineStore('meeting/chat', () => {
	const config = inject<AppConfig>('$config')!;
	const messages = ref<UiChatMessageType[]>([]);
	const controller = ref<ChatWebSocketApi | null>(null);
	const reconnecting = ref(false);

	const authStore = useAuthStore();
	const { initialize: getNewToken } = authStore;
	const { accessToken, xPortalDevice } = storeToRefs(authStore);

	const authData = computed<AuthData>(() => ({
		'X-Portal-Access': accessToken.value,
		'X-Portal-Device': xPortalDevice.value,
		'X-Portal-Client': config!.token.appToken,
	}));

	const lastMessage = computed(() => messages.value.at(-1) || null);
	const isConnected = computed(() => controller.value?.isConnected);

	function createController() {
		controller.value = useChatWebSocket(config.chat.host);
	}

	function connect() {
		if (!controller.value) createController();
		controller.value.open(authData.value);
		subscribeIncomingMessage();
	}

	const { dispatchMessage, sendPendingMessages } = useSafeChatMessaging({
		sendMethod: (payload) => {
			return controller.value.sendMessage(payload);
		},
	});

	watch(
		isConnected,
		(value) => {
			if (value) {
				sendPendingMessages();
				if (lastMessage.value) reloadHistory();
			} else if (!reconnecting.value && !value) {
				handleDisconnect();
			}
		},
		{
			immediate: true,
		},
	);

	async function handleDisconnect() {
		reconnecting.value = true;
		try {
			disconnect();

			await getNewToken();

			createController();
			connect();
		} catch (e) {
			console.error('Chat reconnection error', e);
		} finally {
			reconnecting.value = false;
		}
	}

	function sendTextMessage(text: string = '') {
		const message = generateMessage(WebsocketPayloadType.SendMessage, {
			text,
		});
		dispatchMessage(message);
	}

	async function uploadFile(file: File, retry = 3): Promise<string> {
		try {
			const { uploadId } = await PortalFilesAPI.post({
				url: config!.chat.filesEndpointUrl,
				file: {
					name: file.name,
					mimeType: file.type,
				},
				headers: authData.value,
			});

			const fileData = await PortalFilesAPI.put({
				url: config!.chat.filesEndpointUrl,
				file,
				uploadId,
				headers: authData.value,
			});
			return fileData;
		} catch (e) {
			if (retry > 0) return uploadFile(file, retry - 1);
			throw e;
		}
	}

	async function sendFiles(files: File[]) {
		const uploadedFiles = await Promise.all(
			files.map((file) => uploadFile(file)),
		);

		uploadedFiles.forEach(
			({ fileId: id, size, mimeType: type, name, hash: url }) => {
				const message = generateMessage(WebsocketPayloadType.SendMessage, {
					file: {
						id,
						size,
						type,
						name,
						url,
					},
				});
				dispatchMessage(message);
			},
		);
	}

	async function loadFile(fileId: string) {
		await PortalFilesAPI.get({
			url: `${config!.chat.filesEndpointUrl}/${fileId}`,
			headers: authData.value,
		});
	}

	// reload message history
	// we are not uploading all history, but new messages from the offset of the last one saved on our side

	function reloadHistory() {
		const message = generateHistoryMessage(lastMessage.value.message);
		dispatchMessage(message);
	}

	function disconnect() {
		if (controller.value) {
			controller.value.close();
			controller.value = null;
		}
	}

	// TODO - порефакторити в кінці
	function subscribeIncomingMessage() {
		controller.value.onMessage((wsMessage) => {
			const rootType = wsMessage.data?.['@type'];

			if (
				rootType === generateProtoType(WebsocketMessageType.Response) &&
				wsMessage.data?.data?.['@type'] ===
					generateProtoType(WebsocketMessageType.UpdateNewMessage)
			) {
				if (wsMessage.data.data) messages.value.push(wsMessage.data.data);
			}

			if (
				rootType === generateProtoType(WebsocketMessageType.UpdateNewMessage) &&
				wsMessage.data?.dispo === 'Incoming'
			) {
				if (wsMessage.data) messages.value.push(wsMessage.data);
			}
		});
	}

	return {
		messages,
		isConnected,

		connect,
		disconnect,
		sendTextMessage,
		sendFiles,
		loadFile,
	};
});
