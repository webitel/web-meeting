import '@webitel/ui-sdk/dist/ui-sdk.css';

import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk';
import * as locales from '@webitel/ui-sdk/locale';
import { eventBus } from '@webitel/ui-sdk/scripts';

import { i18n } from '../../locale/i18n';

const globals = {
  $baseURL: import.meta.env.BASE_URL,
};


Object.entries(locales).forEach(([locale, messages]) => {
  i18n.global.mergeLocaleMessage(locale, messages);
});

export const webitelUiPlugin = WebitelUI;
export const webitelUiOptions = { eventBus, globals };
