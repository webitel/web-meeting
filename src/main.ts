import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './the-app.vue';
import router from './app/router';
import { i18n } from './app/locale/i18n';
import {webitelUiPlugin, webitelUiOptions} from './app/plugins/@webitel/ui-sdk';

const pinia = createPinia();

const fetchConfig = async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}/config.json`);
    return response.json();
};

const initApp = async () => {
    const app = createApp(App)
      .use(i18n)
      .use(pinia)
      .use(webitelUiPlugin, webitelUiOptions)
      .use(router);
  
    return app;
};
  
  (async () => {
    let config;
    try {
      config = await fetchConfig();
    } catch (err) {
      console.error('before app mount error:', err);
    } finally {
      const app = await initApp();
      app.provide('$config', config);
      app.mount('#app');
    }
  })();
