import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { i18n } from './app/locale/i18n';
import {
	plugin as WebitelUi,
	options as WebitelUiOptions,
} from './app/plugins/webitel/ui-sdk';
import './app/plugins/@webitel/ui-chats';
import { initRouter, router } from './app/router';
import { initializeConfig } from './modules/appConfig/config';
import App from './the-app.vue';
import {
	forceFirefoxToEnumerateDevices,
	isFirefox,
} from './modules/devices/modules/permissions/scripts/handleFirefoxUserMedia';

const pinia = createPinia();

const initApp = async () => {
	const app = createApp(App).use(i18n).use(pinia);

	try {
		await initRouter();
	} catch (err) {
		console.error('Error initializing router', err);
	}

	app.use(router);
	app.use(WebitelUi, {
		...WebitelUiOptions,
		router,
	}); // setup webitel ui after router init

	return app;
};

(async () => {
	if (isFirefox()) {
		await forceFirefoxToEnumerateDevices(); // https://webitel.atlassian.net/browse/WTEL-8544?focusedCommentId=717571
	}
	const config = await initializeConfig();
	const app = await initApp();
	await router.isReady();
	app.provide('$config', config);
	app.mount('#app');
})();
