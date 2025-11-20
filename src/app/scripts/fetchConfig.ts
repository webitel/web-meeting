import jsoncParser from 'tiny-jsonc';
import type { AppConfig } from '../../types/config';

export const fetchConfig = async (): Promise<AppConfig> => {
    return await fetchWithLocalConfigPriority();
};

async function fetchWithLocalConfigPriority() {
    const localConfig = await fetchSupportedExtConfig('config.local');
    if (localConfig) return localConfig;

    const config = await fetchSupportedExtConfig('config');
    return config;
  }

async function fetchSupportedExtConfig(fileName: string = 'config') {
    const supportedExtensions = ['.json', '.jsonc'];

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
