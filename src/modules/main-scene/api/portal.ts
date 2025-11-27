import { instance } from '../../../app/api/instance';
import { TokenRequest, AccessToken } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/auth_pb';

const postPortalToken = async (credentials: TokenRequest): Promise<AccessToken> => {

  const url = '/portal/token';
  return instance.post(url, credentials)
};

export const PortalAPI = {
  postPortalToken,
}
