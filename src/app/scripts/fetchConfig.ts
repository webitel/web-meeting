import jsoncParser from 'tiny-jsonc';
import merge from 'lodash/merge';
import type { AppConfig } from '../../types/config';

export const fetchConfig = async (): Promise<AppConfig> => {
  return await fetchWithLocalConfigPriority();
};

async function fetchWithLocalConfigPriority() {
  const localConfig = await fetchSupportedExtConfig('config.local');
  const config = await fetchSupportedExtConfig('config');
  return merge(config ?? {}, localConfig ?? {});
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
