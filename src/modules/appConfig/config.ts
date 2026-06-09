import { createAppConfig } from '@webitel/ui-sdk/modules/AppConfig';

import { defaultConfig } from './defaults/defaultConfig';
import type { AppConfig } from './types/AppConfig';

export const { getConfig, initializeConfig } =
	createAppConfig<AppConfig>(defaultConfig);
