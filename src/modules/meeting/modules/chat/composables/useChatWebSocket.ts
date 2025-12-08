import { useWebSocket } from '@vueuse/core';
import { ref } from 'vue';
import { isEmpty } from '@webitel/ui-sdk';
import type {
	ChatWebSocketParams,
	SendMessagePayload,
	ChatWebSocketApi,
} from '../types/chat';

// в кінці прибрати консоль логи

export const useChatWebSocket = ({
	url,
	authData,
}: ChatWebSocketParams): ChatWebSocketApi => {
	const isConnected = ref(false);

	const { send, open, close } = useWebSocket(url, {
		immediate: false,
		autoReconnect: {
			retries: Infinity,
			delay: 1000,
		},
		heartbeat: {
			message: 'pong',
			responseMessage: 'pong',
			interval: 30000,
			pongTimeout: 5000,
		},
		onConnected() {
			try {
				send(
					JSON.stringify({
						meta: authData,
					}),
				);
				isConnected.value = true;
			} catch (e) {
				console.error('WS send auth error', e);
			}
		},
		onMessage(ws: WebSocket, event: MessageEvent<string>) {
			if (isEmpty(event.data)) return;

			try {
				return JSON.parse(event.data);
			} catch (e) {
				console.error('WS parse error', e);
			}
		},
		onError(error) {
			console.error('[WS] error:', error);
		},
		onDisconnected(event) {
			isConnected.value = false;
			console.log('[WS] disconnected:', event);
		},
	});

	function sendMessage({ payload }: SendMessagePayload): boolean {
		return send(JSON.stringify(payload));
	}

	return {
		isConnected,

		sendMessage,
		open,
		close,
	};
};
