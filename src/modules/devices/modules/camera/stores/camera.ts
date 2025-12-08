import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useDevicesList } from '@vueuse/core';

export const useCameraStore = defineStore('devices/camera', () => {
  const { videoInputs: devices } = useDevicesList({
    constraints: { video: true },
  });

  const selectedDeviceId = ref<string>('');

  const stream = ref<MediaStream | null>(null);

  const selectedDevice = computed(() =>
    devices.value.find((device) => device.deviceId === selectedDeviceId.value),
  );

  watch(devices, (devices) => {
    if (devices?.length > 0 && !selectedDeviceId.value) {
      selectedDeviceId.value = devices[0]?.deviceId ?? '';
    }
  });

  /**
   * Set selected camera
   */
  function setSelectedDevice(deviceId: string): void {
    selectedDeviceId.value = deviceId;
  }

  /**
   * Start camera stream for testing
   */
  async function startStream(
    deviceId: string = selectedDeviceId.value,
  ): Promise<MediaStream | null> {
    // Stop any existing stream
    stopStream();

    if (!deviceId) return null;

    // Get camera stream
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
    });

    stream.value = newStream;
    return newStream;
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
    setSelectedDevice,
    startStream,
    stopStream,
    cleanup,
  };
});
