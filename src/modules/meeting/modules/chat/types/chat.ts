import type { Ref } from 'vue';
import type { WebSocketStatus } from '@vueuse/core';
import type { SendMessageRequest } from '@buf/webitel_portal.community_timostamm-protobuf-ts';

export interface AuthData {
	'X-Portal-Access': string;
	'X-Portal-Device': string;
	'X-Portal-Client': string;
}

export interface WSMessage {
	id?: string;
	path?: string;
	data?: unknown;
}

export interface SendMessagePayload {
	id: string;
	path: string;
	data: SendMessageRequest;
}

export interface ChatWebSocketApi {
	status: WebSocketStatus;
	data: string | null;
	sendMessage: (payload: SendMessagePayload) => boolean;
	close: () => void;
	messageHandlers: Ref<WSMessage[]>;
	isConnected: Ref<boolean>;
}
