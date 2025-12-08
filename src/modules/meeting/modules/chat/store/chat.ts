import { defineStore, storeToRefs } from 'pinia';
import { inject, ref, watch } from 'vue';
import { useWebsocketController } from '../../../../../app/websocket/composables/useWebsocketController';
import type { AppConfig } from '../../../../../types/AppConfig';
import { useAuthStore } from '../../../../auth/stores/auth';

export const useChatStore = defineStore('chat', (url: string) => {
	const messages = ref<any[]>([]);
	const newMessage = ref<string | null>(null);
	const config = inject<AppConfig>('$config');
	const { accessToken } = storeToRefs(useAuthStore);

	const controller = useWebsocketController({
		url: config.chat.host,
		protocols: [
			`x-portal-access.${accessToken.value}`,
			`x-device-id:${config.deviceId}`,
			`x-portal-client.${config.token.appToken}`,
		],
	});

	watch(
		() => controller.data.value,
		(msg) => {
			if (!msg) return;
			newMessage.value = msg;
			messages.value.push(msg);
		},
	);

	function connect() {
		if (
			controller.ws?.readyState === WebSocket.OPEN ||
			controller.ws?.readyState === WebSocket.CONNECTING
		) {
			return;
		}
		controller.open();
	}

	function disconnect() {
		controller.closeConnection();
	}

	function send(payload: any) {
		controller.sendMessage(payload);
	}

	return {
		connect,
		disconnect,
		send,
	};
});
