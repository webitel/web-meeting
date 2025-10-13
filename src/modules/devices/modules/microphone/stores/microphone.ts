import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useMicrophoneStore = defineStore('devices/microphone', () => {
    // Device list
    const devices = ref<MediaDeviceInfo[]>([]);

    // Selected device
    const selectedDeviceId = ref<string>('');

    // Testing state
    const stream = ref<MediaStream | null>(null);

    // Computed properties
    const selectedDevice = computed(() =>
        devices.value.find((device) => device.deviceId === selectedDeviceId.value)
    );

    /**
     * Set microphone devices list
     */
    function setDevices(deviceList: MediaDeviceInfo[]): void {
        devices.value = deviceList;

        // Auto-select first device if available and none selected
        if (devices.value.length > 0 && !selectedDeviceId.value) {
            selectedDeviceId.value = devices.value[0].deviceId;
        }
    }

    /**
     * Set selected microphone
     */
    function setSelectedDevice(deviceId: string): void {
        selectedDeviceId.value = deviceId;
        console.log('Microphone changed to:', deviceId);
    }

    /**
     * Get microphone stream for testing
     */
    async function getStream(deviceId: string): Promise<MediaStream | null> {
        try {
            // Stop any existing stream
            stopStream();

            // Get microphone stream
            const newStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: deviceId } },
            });

            stream.value = newStream;
            return newStream;
        } catch (error) {
            console.error('Error getting microphone stream:', error);
            return null;
        }
    }

    /**
     * Stop microphone stream
     */
    function stopStream(): void {
        if (stream.value) {
            stream.value.getTracks().forEach((track) => track.stop());
            stream.value = null;
        }
    }

    /**
     * Cleanup
     */
    function cleanup(): void {
        stopStream();
    }

    return {
        // State
        devices,
        selectedDeviceId,
        stream,

        // Computed
        selectedDevice,

        // Actions
        setDevices,
        setSelectedDevice,
        getStream,
        stopStream,
        cleanup,
    };
});

