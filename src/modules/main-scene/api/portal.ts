import { instance } from '../../../app/api/instance.ts'

const postPortalToken = async (credentials) => {

  const url = '/portal/token';
  return await instance.post(url, credentials)
};

export const PortalAPI = {
  postPortalToken,
}
