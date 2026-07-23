import type { Message as PortalMessage } from '@buf/webitel_chat.community_timostamm-protobuf-ts/messages/message_pb';
import type { SendMessageRequest } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/messages_pb';
import { v4 as uuidv4 } from 'uuid';
import { WebsocketMessageType } from '../enums/WebsocketMessageType';
import type { SendMessagePayload } from '../types/chat';

const protoBaseUrl = 'type.googleapis.com';
const protoNamespace = 'webitel.portal';

export const generateProtoType = (type: string) =>
	`${protoBaseUrl}/${protoNamespace}.${type}`;

export const generateMessage = (
	path: string,
	data: Partial<SendMessageRequest>,
): SendMessagePayload => {
	const id = uuidv4();

	return {
		id,
		path: `${protoNamespace}.${WebsocketMessageType.ChatMessages}/${path}`,
		data: {
			'@type': generateProtoType(WebsocketMessageType.SendMessageRequest),
			id: data.id ?? id,
			kind: data.kind ?? '',
			text: data.text ?? '',
			...data,
		},
	};
};

export const generateHistoryMessage = (
	message: PortalMessage,
): SendMessagePayload => {
	const id = uuidv4();

	return {
		id,
		path: WebsocketMessageType.ChatHistory,
		data: {
			'@type': `${protoBaseUrl}/webitel.chat.${WebsocketMessageType.ChatMessagesRequest}`,
			offset: {
				id: message.id,
			},
			chatId: message.chat?.id,
		},
	};
};
