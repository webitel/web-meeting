import { useWebSocket } from '@vueuse/core';
import { ref } from 'vue';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import type {
	AuthData,
	SendMessagePayload,
	ChatWebSocketApi,
} from '../types/chat';

// в кінці прибрати консоль логи

export const useChatWebSocket = (url: string): ChatWebSocketApi => {
	const isConnected = ref(false);
	const listeners: Array<(data: any) => void> = [];
	const authRef: AuthData | null = ref(null);

	const { send, open, close } = useWebSocket(url, {
		immediate: false,
		autoReconnect: false,
		onConnected() {
			try {
				send(
					JSON.stringify({
						meta: authRef.value,
					}),
				);
				isConnected.value = true;
			} catch (e) {
				console.error('WS send auth error', e);
			}
		},
		onMessage(ws: WebSocket, event: MessageEvent<string>) {
			if (isEmpty(event.data)) return;

			if (event.data === 'ping') {
				ws.send('pong');
				return;
			}

			let parsed;
			try {
				parsed = JSON.parse(event.data);
			} catch (e) {
				console.error('WS parse error', e);
			}
			listeners.forEach((fn) => fn(parsed));
		},
		onError(error) {
			console.error('[WS] error:', error);
		},
		onDisconnected(ws, event) {
			isConnected.value = false;
			console.error('[WS] disconnected', {
				code: event.code,
				reason: event.reason,
				readyState: ws.readyState,
			});
		},
	});

	function sendMessage(payload: SendMessagePayload): boolean {
		return send(JSON.stringify(payload));
	}

	function onMessage(fn: (data: any) => void) {
		listeners.push(fn);
	}

	function openConnection(authData) {
		authRef.value = authData;
		open();
	}

	return {
		isConnected,

		sendMessage,
		onMessage,
		open: openConnection,
		close,
	};
};
