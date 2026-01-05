import merge from 'lodash/merge';
import jsoncParser from 'tiny-jsonc';
import type { AppConfig } from '../../types/config';

let config: AppConfig;

export async function getConfig(): Promise<AppConfig> {
	if (!config) {
		config = await fetchConfig();
	}
	return config;
}

export async function fetchConfig(): Promise<AppConfig> {
	return await fetchWithLocalConfigPriority();
}

async function fetchWithLocalConfigPriority() {
	const localConfig = await fetchSupportedExtConfig('config.local');
	const config = await fetchSupportedExtConfig('config');
	return merge(config ?? {}, localConfig ?? {});
}

async function fetchSupportedExtConfig(fileName: string = 'config') {
	const supportedExtensions = [
		'.json',
		'.jsonc',
	];

	for (const extension of supportedExtensions) {
		try {
			const response = await fetch(`./${fileName}${extension}`);
			if (response.ok) {
				const configText = await response.text();
				return jsoncParser.parse(configText);
			}
		} catch {}
	}
	return null;
}
