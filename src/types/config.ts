/**
 * Type definitions for config.jsonc and config.local.jsonc
 */

export interface AppConfig {
	token: {
		iss: string;
		endpointUrl: string;
		appToken: string;
	};
	call: {
		host: string;
		target: string;
	};
	chat: {
		host: string;
	};
	assets: {
		logoPicture: string;
		mainBackground: string;
	};
	lang: 'en' | 'uk' | 'ru';
	evaluation: {
		endpointUrl: string;
		goodGrade: number;
		badGrade: number;
	};
}

// Make it available globally for Vue's inject system
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$config: AppConfig;
	}
}
