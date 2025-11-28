import type { AxiosRequestConfig } from 'axios';
import { TokenRequest, AccessToken } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/auth_pb';

import { instance } from '../../../app/api/instance';

const postPortalToken = async ({ 
  url,
  headers,
}: Pick<AxiosRequestConfig<TokenRequest>, 'url' | 'headers'>, 
credentials: TokenRequest,
): Promise<AccessToken> => {
  
  return instance.post<AccessToken>(url, credentials, { headers });
};

export const PortalAPI = {
  postPortalToken,
}
