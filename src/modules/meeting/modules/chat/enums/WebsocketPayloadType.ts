export const WebsocketPayloadType = {
	SendMessage: 'SendMessage',
	ChatUpdates: 'ChatUpdates',
} as const;

export type WebsocketPayloadType =
	(typeof WebsocketPayloadType)[keyof typeof WebsocketPayloadType];
