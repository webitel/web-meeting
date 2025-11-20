/**
 * Type definitions for config.jsonc and config.local.jsonc
 */

export interface AppConfig {
    token: {
        endpointUrl: string;
        appToken: string;
    };
    call: {
        host: string;
    };
    temp: {
        device_id: string;
        tokenResponse: {
            access_token: string;
            user_id: string;
            realm: string;
        };
    };
}

// Make it available globally for Vue's inject system
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $config: AppConfig;
    }
}

