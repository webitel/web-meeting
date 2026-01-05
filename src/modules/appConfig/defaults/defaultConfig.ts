import type { PartialDeep } from 'type-fest';

import type { AppConfig } from '../types/AppConfig';

export const defaultConfig: PartialDeep<AppConfig> = {
	call: {
		target: 'service',
		videoDeviceResolution: {
			width: {
				ideal: 1920,
			},
			height: {
				ideal: 1080,
			},
		},
	},
	assets: {
		logoPicture: '/meet/assets/web-logo.svg',
		mainBackground: '/meet/assets/web-background.svg',
	},
	lang: 'en',
	evaluation: {
		goodGrade: 10,
		badGrade: 5,
	},
};
