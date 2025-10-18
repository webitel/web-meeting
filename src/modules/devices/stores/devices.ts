import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useDevicesList } from '@vueuse/core';
import { useMicrophoneStore } from '../modules/microphone/stores/microphone';
import { useSpeakerStore } from '../modules/speaker/stores/speaker';
import { useCameraStore } from '../modules/camera/stores/camera';

/**
 * General device management store
 * Handles device enumeration, permissions, and coordination between individual device stores
 */
export const useDevicesStore = defineStore('devices', () => {
    // Use VueUse's device management
    const {
        ensurePermissions,
        permissionGranted,
    } = useDevicesList({
        // requestPermissions: true, // if true, watchers below should be immediate!!
        constraints: { audio: true, video: true },
    });

    const isRequesting = ref<boolean>(false);
    const error = ref<string>('');

    /**
     * Request browser access to media devices (microphone, camera)
     */
    async function requestDeviceAccess(): Promise<void> {
        isRequesting.value = true;
        error.value = '';

        try {
            await ensurePermissions();
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            throw err;
        } finally {
            isRequesting.value = false;
        }
    }   

    return {
        // State
        hasMicrophoneAccess: permissionGranted,
        hasCameraAccess: permissionGranted,
        isRequesting,
        error,

        // Actions
        requestDeviceAccess,
    };
});

