export const WebsocketPayloadType = {
	SendMessage: 'SendMessage',
	ChatUpdates: 'ChatUpdates',
} as const;

export type WebsocketChatPayloadType =
	(typeof WebsocketPayloadType)[keyof typeof WebsocketPayloadType];
