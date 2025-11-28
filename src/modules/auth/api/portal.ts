import type { AxiosRequestConfig } from 'axios';
import { TokenRequest, AccessToken } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/auth_pb';
import { snakeToCamel, applyTransform, camelToSnake } from '@webitel/api-services/api/transformers';

import { instance } from '../../../app/api/instance';

const postPortalToken = async ({ 
  url,
  headers,
}: Pick<AxiosRequestConfig<TokenRequest>, 'url' | 'headers'>, 
credentials: TokenRequest,
): Promise<AccessToken> => {
  const sentCredentials = applyTransform(credentials, [
    camelToSnake(),
  ]);
  
  const response = await instance.post<AccessToken>(url, sentCredentials, { headers });
  return applyTransform(response.data, [
    snakeToCamel(),
  ]);
};

export const PortalAPI = {
  postPortalToken,
}
