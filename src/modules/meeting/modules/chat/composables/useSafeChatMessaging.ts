import { ref } from 'vue';

export function useSafeChatMessaging(sendMethod) {
	const pendingMessageQueue = ref([]);

	function dispatchMessage(payload) {
		try {
			sendMethod(payload);
		} catch (error) {
			pendingMessageQueue.value.push(payload);
		}
	}

	function sendPendingMessages() {
		if (pendingMessageQueue.value.length === 0) return;

		const queueCopy = [
			...pendingMessageQueue.value,
		];
		pendingMessageQueue.value = [];

		queueCopy.forEach((msg) => dispatchMessage(msg));
	}

	return {
		pendingMessageQueue,

		dispatchMessage,
		sendPendingMessages,
	};
}
