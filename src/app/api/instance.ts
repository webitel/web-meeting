import { generateInstance } from '@webitel/api-services/api/axios';

export const instance = generateInstance({
	baseURL: import.meta.env.VITE_API_URL,
});

delete (instance.defaults.headers as Record<string, unknown>)[
	'X-Webitel-Access'
];

export default instance;
