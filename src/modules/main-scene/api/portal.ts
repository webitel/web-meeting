import { instance } from '../../../app/api/instance.ts';

const postPortalToken = async (credentials) => {

  const url = '/portal/token';
  try {
    const response = await instance.post(url, credentials);
    return response;
  } catch (err) {
    throw err;
  }
};

export const PortalAPI = {
  postPortalToken,
}
