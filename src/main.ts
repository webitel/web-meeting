import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { i18n } from './app/locale/i18n';
import {
	webitelUiOptions,
	webitelUiPlugin,
} from './app/plugins/@webitel/ui-sdk';
import router from './app/router';
import { fetchConfig } from './app/scripts/fetchConfig';
import App from './the-app.vue';

const pinia = createPinia();

const initApp = async () => {
	const app = createApp(App)
		.use(i18n)
		.use(pinia)
		.use(webitelUiPlugin, webitelUiOptions)
		.use(router);

	return app;
};

(async () => {
	const config = await fetchConfig();
	const app = await initApp();
	app.provide('$config', config);
	app.mount('#app');
})();
