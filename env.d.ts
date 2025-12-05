/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_JSSIP_AUTHORIZATION_USER: string;
	readonly VITE_JSSIP_DISPLAY_NAME: string;
	readonly VITE_JSSIP_EXTENSION: string;
	readonly VITE_JSSIP_HA1: string;
	readonly VITE_JSSIP_REALM: string;
	readonly VITE_JSSIP_SERVER: string;
	readonly VITE_JSSIP_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
