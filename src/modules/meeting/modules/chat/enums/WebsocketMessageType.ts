export const WebsocketMessageType = {
	SendMessageRequest: 'SendMessageRequest',
	ChatMessages: 'ChatMessages',
	Response: 'Response',
	UpdateNewMessage: 'UpdateNewMessage',
} as const;

export type WebsocketChatMessageType =
	(typeof WebsocketMessageType)[keyof typeof WebsocketMessageType];
