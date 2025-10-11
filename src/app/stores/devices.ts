import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useMicrophoneStore } from '../../modules/devices/modules/microphone/stores/microphone';
import { useSpeakerStore } from '../../modules/devices/modules/speaker/stores/speaker';
import { useCameraStore } from '../../modules/devices/modules/camera/stores/camera';

/**
 * General device management store
 * Handles device enumeration, permissions, and coordination between individual device stores
 */
export const useDevicesStore = defineStore('devices', () => {
    // Permission state
    const hasAccess = ref<boolean>(false);
    const isRequesting = ref<boolean>(false);
    const error = ref<string>('');

    /**
     * Request browser access to media devices (microphone, camera)
     */
    async function requestDeviceAccess(): Promise<void> {
        isRequesting.value = true;
        error.value = '';

        try {
            // Request access to audio and video
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });

            // Stop all tracks immediately after getting permission
            stream.getTracks().forEach((track) => track.stop());

            hasAccess.value = true;

            // Enumerate devices after getting permission
            await enumerateDevices();
        } catch (err) {
            hasAccess.value = false;
            if (err instanceof Error) {
                error.value = `Failed to access devices: ${err.message}`;
            } else {
                error.value = 'Failed to access devices. Please check your permissions.';
            }
            console.error('Error requesting device access:', err);
        } finally {
            isRequesting.value = false;
        }
    }

    /**
     * Enumerate all available media devices and distribute them to individual stores
     */
    async function enumerateDevices(): Promise<void> {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const microphones = devices.filter((device) => device.kind === 'audioinput');
            const speakers = devices.filter((device) => device.kind === 'audiooutput');
            const cameras = devices.filter((device) => device.kind === 'videoinput');

            // Update individual device stores
            const microphoneStore = useMicrophoneStore();
            const speakerStore = useSpeakerStore();
            const cameraStore = useCameraStore();

            microphoneStore.setDevices(microphones);
            speakerStore.setDevices(speakers);
            cameraStore.setDevices(cameras);
        } catch (err) {
            error.value = 'Failed to enumerate devices';
            console.error('Error enumerating devices:', err);
        }
    }

    /**
     * Initialize device change listener
     * Automatically re-enumerates devices when they are plugged/unplugged
     */
    function initializeDeviceChangeListener(): void {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.addEventListener('devicechange', () => {
                if (hasAccess.value) {
                    enumerateDevices();
                }
            });
        }
    }

    /**
     * Cleanup all device streams
     */
    function cleanup(): void {
        const microphoneStore = useMicrophoneStore();
        const cameraStore = useCameraStore();

        microphoneStore.cleanup();
        cameraStore.cleanup();
    }

    return {
        // State
        hasAccess,
        isRequesting,
        error,

        // Actions
        requestDeviceAccess,
        enumerateDevices,
        initializeDeviceChangeListener,
        cleanup,
    };
});

