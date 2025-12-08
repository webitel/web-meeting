import { v4 as uuidv4 } from 'uuid';
import { SendMessageRequest } from '@buf/webitel_portal.community_timostamm-protobuf-ts';
import { WebsocketPortalType } from '../enums/WebsocketPortalType';
import { WebsocketPayloadType } from '../enums/WebsocketPayloadType';

export const useGenerateProto = () => {
	const protoBaseUrl = 'type.googleapis.com';
	const protoNamespace = 'webitel.portal';

	function generateProtoType(type: WebsocketPayloadType) {
		return `${protoBaseUrl}/${protoNamespace}.${type}`;
	}

	function generateMessage(path: string, data: SendMessageRequest) {
		const id = uuidv4();

		return {
			id,
			path: `${protoNamespace}.${WebsocketPortalType.ChatMessages}/${path}`,
			data: {
				'@type': generateProtoType(WebsocketPortalType.ChatMessages),
				...data,
			},
		};
	}

	return {
		generateProtoType,
		generateMessage,
	};
};
