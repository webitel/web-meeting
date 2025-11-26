import { instance } from '../../../app/api/instance'

const postPortalToken = async (credentials) => {

  const url = '/portal/token';
  return await instance.post(url, credentials)
};

export const PortalAPI = {
  postPortalToken,
}
