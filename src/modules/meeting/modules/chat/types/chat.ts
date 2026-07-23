import type { Message as PortalMessage } from '@buf/webitel_chat.community_timostamm-protobuf-ts/messages/message_pb';
import type { SendMessageRequest } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/messages_pb';
import type { Ref } from 'vue';

export interface AuthData {
	'X-Portal-Access': string;
	'X-Portal-Device': string;
	'X-Portal-Client': string;
	[key: string]: string;
}

export interface WSMessage {
	id?: string;
	path?: string;
	data?: unknown;
}

export interface SendMessagePayload {
	id: string;
	path: string;
	data: Record<string, unknown> & {
		'@type'?: string;
	};
}

export interface ChatWebSocketApi {
	isConnected: Ref<boolean>;
	sendMessage: (payload: SendMessagePayload) => boolean;
	onMessage: (fn: (data: unknown) => void) => void;
	open: (auth: AuthData) => void;
	close: () => void;
}

export type { PortalMessage, SendMessageRequest };
