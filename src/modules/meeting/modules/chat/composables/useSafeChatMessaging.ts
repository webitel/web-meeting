import { ref } from 'vue';
import type { SendMessagePayload } from '../types/chat';

export function useSafeChatMessaging({
	sendMethod,
}: {
	sendMethod: (payload: SendMessagePayload) => unknown;
}) {
	const pendingMessageQueue = ref<SendMessagePayload[]>([]);

	async function dispatchMessage(payload: SendMessagePayload) {
		try {
			await sendMethod(payload);
		} catch (_error) {
			pendingMessageQueue.value.push(payload);
		}
	}

	function sendPendingMessages() {
		if (pendingMessageQueue.value.length === 0) return;

		const queueCopy = [
			...pendingMessageQueue.value,
		];
		pendingMessageQueue.value = [];

		queueCopy.forEach((msg) => {
			dispatchMessage(msg);
		});
	}

	return {
		pendingMessageQueue,

		dispatchMessage,
		sendPendingMessages,
	};
}
