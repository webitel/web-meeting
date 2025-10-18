import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useDevicesList } from '@vueuse/core';

export const useMicrophoneStore = defineStore('devices/microphone', () => {

    const { audioInputs: devices } = useDevicesList({
        constraints: { audio: true },
    });

    const selectedDeviceId = ref<string>('');

    const stream = ref<MediaStream | null>(null);

    const selectedDevice = computed(() =>
        devices.value.find((device) => device.deviceId === selectedDeviceId.value)
    );

    watch(devices, (devices) => {
        if (devices?.length > 0 && !selectedDeviceId.value) {
            selectedDeviceId.value = devices[0]?.deviceId ?? '';
        }
    });

    function setSelectedDevice(deviceId: string): void {
        selectedDeviceId.value = deviceId;
    }

    /**
     * Start microphone stream for testing
     */
    async function startStream(deviceId: string = selectedDeviceId.value): Promise<MediaStream | null> {
            // Stop any existing stream
            stopStream();

            if (!deviceId) return null;

            // Get microphone stream
            const newStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: deviceId } },
            });

            stream.value = newStream;
            return newStream;
    }

    /**
     * Stop microphone stream
     */
    function stopStream(): void {
        if (!stream.value) return;

        stream.value.getTracks().forEach((track) => track.stop());
        stream.value = null;
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
        setSelectedDevice,
        startStream,
        stopStream,
        cleanup,
    };
});

