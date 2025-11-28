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
    };
}

// Make it available globally for Vue's inject system
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $config: AppConfig;
    }
}

