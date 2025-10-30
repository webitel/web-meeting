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
    // 1. Audio only
    const {
        ensurePermissions: ensureAudioPermissions,
        permissionGranted: audioPermissionGranted,
    } = useDevicesList({
        constraints: { audio: true, video: false },
    });

    // 2. Video only
    const {
        ensurePermissions: ensureVideoPermissions,
        permissionGranted: videoPermissionGranted,
    } = useDevicesList({
        constraints: { audio: false, video: true },
    });

    // 3. All together (audio + video)
    const {
        ensurePermissions: ensureAllPermissions,
        permissionGranted: allPermissionsGranted,
    } = useDevicesList({
        constraints: { audio: true, video: true },
    });

    const isRequesting = ref<boolean>(false);
    const error = ref<string>('');

    /**
     * Request browser access to audio device (microphone)
     */
    async function requestAudioAccess(): Promise<void> {
        isRequesting.value = true;
        error.value = '';

        try {
            await ensureAudioPermissions();
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            throw err;
        } finally {
            isRequesting.value = false;
        }
    }

    /**
     * Request browser access to video device (camera)
     */
    async function requestVideoAccess(): Promise<void> {
        isRequesting.value = true;
        error.value = '';

        try {
            await ensureVideoPermissions();
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            throw err;
        } finally {
            isRequesting.value = false;
        }
    }

    /**
     * Request browser access to all devices (audio and video)
     */
    async function requestDeviceAccess(): Promise<void> {
        isRequesting.value = true;
        error.value = '';

        try {
            await ensureAllPermissions();
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            throw err;
        } finally {
            isRequesting.value = false;
        }
    }

    return {
        // State
        hasMicrophoneAccess: audioPermissionGranted,
        hasCameraAccess: videoPermissionGranted,
        hasAllAccess: allPermissionsGranted,
        isRequesting,
        error,

        // Actions
        requestAudioAccess,
        requestVideoAccess,
        requestDeviceAccess,
    };
});

