import { useWebSocket } from '@vueuse/core';

// @Lera24
// delete at the end if not using

export const useWebsocketController = ({ url, protocols }) => {
	const { status, data, send, open, close } = useWebSocket(url, {
		protocols,
		immediate: false,
		onConnected(_ws) {
			// reserved for future
			// send(JSON.stringify({ type: 'WSState' }))
		},
		onMessage(event) {
			const _data = JSON.parse(event.data);
		},
		onError(error) {
			console.error('[WS] error:', error);
		},
		onDisconnected(event) {
			console.log('[WS] disconnected:', event);
		},
	});

	function sendMessage(payload: any) {
		return send(JSON.stringify(payload));
	}

	function closeConnection() {
		return close(1000, 'client closed connection');
	}

	return {
		status,
		data,
		sendMessage,
		open,
		closeConnection,
	};
};
