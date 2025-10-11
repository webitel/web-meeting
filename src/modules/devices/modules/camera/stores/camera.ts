import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCameraStore = defineStore('camera', () => {
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
     * Set camera devices list
     */
    function setDevices(deviceList: MediaDeviceInfo[]): void {
        devices.value = deviceList;

        // Auto-select first device if available and none selected
        if (devices.value.length > 0 && !selectedDeviceId.value) {
            selectedDeviceId.value = devices.value[0].deviceId;
        }
    }

    /**
     * Set selected camera
     */
    function setSelectedDevice(deviceId: string): void {
        selectedDeviceId.value = deviceId;
        console.log('Camera changed to:', deviceId);
    }

    /**
     * Get camera stream for testing
     */
    async function getStream(deviceId: string): Promise<MediaStream | null> {
        try {
            // Stop any existing stream
            stopStream();

            // Get camera stream
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
            });

            stream.value = newStream;
            return newStream;
        } catch (error) {
            console.error('Error getting camera stream:', error);
            return null;
        }
    }

    /**
     * Stop camera stream
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

