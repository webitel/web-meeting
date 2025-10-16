import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useMicrophoneStore } from '../modules/microphone/stores/microphone';
import { useSpeakerStore } from '../modules/speaker/stores/speaker';
import { useCameraStore } from '../modules/camera/stores/camera';

/**
 * General device management store
 * Handles device enumeration, permissions, and coordination between individual device stores
 */
export const useDevicesStore = defineStore('devices', () => {
    // Permission state
    const hasMicrophoneAccess = ref<boolean>(false);
    const hasCameraAccess = ref<boolean>(false);
    const isRequesting = ref<boolean>(false);
    const error = ref<string>('');

    /**
     * Request browser access to microphone
     */
    async function requestMicrophoneAccess(): Promise<void> {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            audioStream.getTracks().forEach((track) => track.stop());
            hasMicrophoneAccess.value = true;
        } catch (err) {
            hasMicrophoneAccess.value = false;
            console.error('Error requesting microphone access:', err);
            if (err instanceof Error) {
                const micError = `Failed to access microphone: ${err.message}`;
                error.value = error.value
                    ? `${error.value}; ${micError}`
                    : micError;
            }
        }
    }

    /**
     * Request browser access to camera
     */
    async function requestCameraAccess(): Promise<void> {
        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            videoStream.getTracks().forEach((track) => track.stop());
            hasCameraAccess.value = true;
        } catch (err) {
            hasCameraAccess.value = false;
            console.error('Error requesting camera access:', err);
            if (err instanceof Error) {
                const cameraError = `Failed to access camera: ${err.message}`;
                error.value = error.value
                    ? `${error.value}; ${cameraError}`
                    : cameraError;
            }
        }
    }

    /**
     * Request browser access to media devices (microphone, camera)
     */
    async function requestDeviceAccess(): Promise<void> {
        isRequesting.value = true;
        error.value = '';

        // Request microphone and camera access
        await requestMicrophoneAccess();
        await requestCameraAccess();

        // If both failed, show a general error
        if (!hasMicrophoneAccess.value && !hasCameraAccess.value) {
            error.value = error.value || 'Failed to access devices. Please check your permissions.';
        }

        isRequesting.value = false;

        // Enumerate devices after getting permission
        await enumerateDevices();
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
     * Device change event handler
     */
    const handleDeviceChange = () => {
        if (hasMicrophoneAccess.value || hasCameraAccess.value) {
            enumerateDevices();
        }
    };

    /**
     * Initialize device change listener
     * Automatically re-enumerates devices when they are plugged/unplugged
     */
    function initializeDeviceChangeListener(): void {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
        }
    }

    /**
     * Remove device change listener
     */
    function removeDeviceChangeListener(): void {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
        }
    }

    /**
     * Cleanup all device streams and listeners
     */
    function cleanup(): void {
        const microphoneStore = useMicrophoneStore();
        const cameraStore = useCameraStore();

        microphoneStore.cleanup();
        cameraStore.cleanup();
        removeDeviceChangeListener();
    }

    return {
        // State
        hasMicrophoneAccess,
        hasCameraAccess,
        isRequesting,
        error,

        // Actions
        requestDeviceAccess,
        requestMicrophoneAccess,
        requestCameraAccess,
        enumerateDevices,
        initializeDeviceChangeListener,
        cleanup,
    };
});

