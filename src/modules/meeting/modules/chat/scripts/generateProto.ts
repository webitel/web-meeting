import { v4 as uuidv4 } from 'uuid';
import { SendMessageRequest } from '@buf/webitel_portal.community_timostamm-protobuf-ts';
import { WebsocketMessageType } from '../enums/WebsocketMessageType';

const protoBaseUrl = 'type.googleapis.com';
const protoNamespace = 'webitel.portal';

export const generateProtoType = (type) =>
	`${protoBaseUrl}/${protoNamespace}.${type}`;

export const generateMessage = (path: string, data: SendMessageRequest) => {
	const id = uuidv4();

	return {
		id,
		path: `${protoNamespace}.${WebsocketMessageType.ChatMessages}/${path}`,
		data: {
			'@type': generateProtoType(WebsocketMessageType.SendMessageRequest),
			...data,
		},
	};
};
