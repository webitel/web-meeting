export const WebsocketPortalType = {
	SendMessageRequest: 'SendMessageRequest',
	ChatMessages: 'ChatMessages',
	Response: 'Response',
	UpdateNewMessage: 'UpdateNewMessage',
} as const;

export type WebsocketPortalType =
	(typeof WebsocketPortalType)[keyof typeof WebsocketPortalType];
