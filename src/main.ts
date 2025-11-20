import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './the-app.vue';
import router from './app/router';
import { i18n } from './app/locale/i18n';
import {webitelUiPlugin, webitelUiOptions} from './app/plugins/@webitel/ui-sdk';
import { fetchConfig } from './app/scripts/fetchConfig';

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
