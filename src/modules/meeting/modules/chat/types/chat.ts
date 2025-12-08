import type { Ref } from 'vue';
import type { WebSocketStatus } from '@vueuse/core';
import type { WebSocketStatus } from '@vueuse/core';
import { SendMessageRequest } from '@buf/webitel_portal.community_timostamm-protobuf-ts';

export interface AuthData {
	'X-Portal-Access': string | null;
	'X-Portal-Device': string;
	'X-Portal-Client': string;
}

export interface ControllerParams {
	url: string;
	authData: AuthData;
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

export interface ChatWebSocket {
	status: WebSocketStatus;
	data: string | null;
	sendMessage: (payload: SendMessagePayload) => boolean;
	close: () => void;
	messageHandlers: Ref<WSMessage[]>;
	isConnected: Ref<boolean>;
}
