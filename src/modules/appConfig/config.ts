import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import type { AppConfig } from './types/AppConfig';
import { fetchConfig } from './scripts/fetchConfig';
import { defaultConfig } from './defaults/defaultConfig';

let config: AppConfig;

export async function getConfig(): Promise<AppConfig> {
	if (!config) {
		config = await initializeConfig();
	}
	return config;
}

export async function initializeConfig(): Promise<AppConfig> {
	const fetchedConfig = await fetchConfig();
	const fullConfig = merge(cloneDeep(defaultConfig), fetchedConfig);

	config = fullConfig;

	return fullConfig;
}
