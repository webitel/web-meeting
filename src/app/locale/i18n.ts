import { createI18n } from 'vue-i18n';
import { TranslationLocale } from '@webitel/ui-sdk/locale';

import en from './en/en';
import ru from './ru/ru';
import uk from './uk/uk';

const messages = {
  [TranslationLocale.en]: en,
  [TranslationLocale.ru]: ru,
  [TranslationLocale.uk]: uk,
};

export const i18n = createI18n({
  locale: TranslationLocale.en,
  fallbackLocale: TranslationLocale.en,
  messages,
  legacy: false,
});
