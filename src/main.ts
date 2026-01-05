import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { i18n } from './app/locale/i18n';
import {
	webitelUiOptions,
	webitelUiPlugin,
} from './app/plugins/@webitel/ui-sdk';
import router from './app/router';
import { initializeConfig } from './modules/appConfig/config';
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
	const config = await initializeConfig();
	const app = await initApp();
	await router.isReady();
	app.provide('$config', config);
	app.mount('#app');
})();
