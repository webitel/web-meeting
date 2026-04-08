import { getDefaultInstance } from '@webitel/api-services/api/defaults';

export const instance = getDefaultInstance();

delete (instance.defaults.headers as Record<string, unknown>)[
	'X-Webitel-Access'
];
instance.interceptors.request.clear();

export default instance;
