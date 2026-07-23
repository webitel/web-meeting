import type { UpdateNewMessage } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/messages_pb';
import { defineStore, storeToRefs } from 'pinia';
import { computed, inject, ref, shallowRef, watch } from 'vue';
import type { AppConfig } from '../../../../appConfig/types/AppConfig';
import { useAuthStore } from '../../../../auth/stores/auth';
import { PortalFilesAPI } from '../../chat/api/portalFiles';
import { useChatWebSocket } from '../composables/useChatWebSocket.ts';
import { useSafeChatMessaging } from '../composables/useSafeChatMessaging';
import { WebsocketMessageType } from '../enums/WebsocketMessageType';
import { WebsocketPayloadType } from '../enums/WebsocketPayloadType';
import {
	generateHistoryMessage,
	generateMessage,
	generateProtoType,
} from '../scripts/generateMessage';
import type {
	AuthData,
	ChatWebSocketApi,
	SendMessagePayload,
} from '../types/chat';

type PortalWsEnvelope = {
	data?: {
		'@type'?: string;
		data?: UpdateNewMessage & {
			'@type'?: string;
		};
		dispo?: string;
	} & Partial<UpdateNewMessage>;
};

export const useChatStore = defineStore('meeting/chat', () => {
	const config = inject<AppConfig>('$config') as AppConfig;
	const messages = ref<UpdateNewMessage[]>([]);
	const controller = shallowRef<ChatWebSocketApi | null>(null);
	const reconnecting = ref(false);

	const authStore = useAuthStore();
	const { initialize: getNewToken } = authStore;
	const { accessToken, xPortalDevice } = storeToRefs(authStore);

	const authData = computed<AuthData | null>(() => {
		if (!accessToken.value) return null;
		return {
			'X-Portal-Access': accessToken.value,
			'X-Portal-Device': xPortalDevice.value,
			'X-Portal-Client': config?.token.appToken,
		};
	});

	const lastMessage = computed(() => messages.value.at(-1) || null);
	const isConnected = computed(
		() => controller.value?.isConnected.value ?? false,
	);

	function createController() {
		controller.value = useChatWebSocket(config.chat.host);
	}

	function connect() {
		if (!authData.value) return;
		if (!controller.value) createController();
		controller.value?.open(authData.value);
		subscribeIncomingMessage();
	}

	const { dispatchMessage, sendPendingMessages } = useSafeChatMessaging({
		sendMethod: (payload: SendMessagePayload) => {
			return controller.value?.sendMessage(payload) ?? false;
		},
	});

	watch(
		isConnected,
		(value, oldValue) => {
			if (value) {
				sendPendingMessages();
				if (lastMessage.value) reloadHistory();
			} else if (!reconnecting.value && oldValue) {
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

	async function uploadFile(
		file: File,
		retry = 3,
	): Promise<Awaited<ReturnType<typeof PortalFilesAPI.put>>> {
		if (!authData.value) throw new Error('Not authenticated');
		try {
			const { uploadId } = await PortalFilesAPI.post({
				url: config.chat.filesEndpointUrl,
				file: {
					name: file.name,
					mimeType: file.type,
				},
				headers: authData.value,
			});

			return await PortalFilesAPI.put({
				url: config.chat.filesEndpointUrl,
				file,
				uploadId,
				headers: authData.value,
			});
		} catch (e) {
			if (retry > 0) return uploadFile(file, retry - 1);
			throw e;
		}
	}

	function buildFileUrl(fileUrl: string): string {
		if (!authData.value) return fileUrl;
		const params = new URLSearchParams(
			Object.fromEntries(
				Object.entries(authData.value).map(([key, value]) => [
					key.toLowerCase(),
					value,
				]),
			),
		);
		return `${fileUrl}?${params.toString()}`;
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
		if (!authData.value) return;
		await PortalFilesAPI.get({
			url: `${config.chat.filesEndpointUrl}/${fileId}`,
			headers: authData.value,
		});
	}

	// reload message history
	// we are not uploading all history, but new messages from the offset of the last one saved on our side

	function reloadHistory() {
		const portalMessage = lastMessage.value?.message;
		if (!portalMessage) return;
		const message = generateHistoryMessage(portalMessage);
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
		controller.value?.onMessage((raw) => {
			const wsMessage = raw as PortalWsEnvelope;
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
				if (wsMessage.data)
					messages.value.push(wsMessage.data as UpdateNewMessage);
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
		buildFileUrl,
	};
});
