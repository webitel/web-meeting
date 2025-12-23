import type {
	AccessToken,
	TokenRequest,
} from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/auth_pb';
import {
	applyTransform,
	camelToSnake,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import type { AxiosRequestConfig } from 'axios';

import { instance } from '../../../app/api/instance';

const postPortalToken = async (
	{ url, headers }: Pick<AxiosRequestConfig<TokenRequest>, 'url' | 'headers'>,
	credentials: TokenRequest,
): Promise<AccessToken> => {
	console.log('credentials', credentials);
	console.log('url', url);
	console.log('headers', headers);
	const sentCredentials = applyTransform(credentials, [
		camelToSnake(),
	]);
	console.log('sentCredentials', sentCredentials);

	const response = await instance.post<AccessToken>(url, sentCredentials, {
		headers,
	});
	return applyTransform(response.data, [
		snakeToCamel(),
	]);
};

export const PortalAPI = {
	postPortalToken,
};
