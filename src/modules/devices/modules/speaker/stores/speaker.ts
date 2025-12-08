import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useDevicesList } from '@vueuse/core';

export const useSpeakerStore = defineStore('devices/speaker', () => {
  const { audioOutputs: devices } = useDevicesList({
    constraints: { audio: true },
  });

  const selectedDeviceId = ref<string>('');

  const selectedDevice = computed(() =>
    devices.value.find((device) => device.deviceId === selectedDeviceId.value),
  );

  /**
   * Set speaker devices list
   */
  watch(devices, (devices) => {
    if (devices.length > 0 && !selectedDeviceId.value) {
      selectedDeviceId.value = devices[0]?.deviceId ?? '';
    }
  });

  /**
   * Set selected speaker
   */
  function setSelectedDevice(device): void {
    selectedDeviceId.value = device.deviceId ?? '';
  }

  /**
   * Play test beep sound for speaker
   */
  async function playTestBeep(deviceId: string): Promise<void> {
    try {
      // Create audio context
      const audioContext = new AudioContext();

      // Create oscillator for beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure beep sound (800 Hz, 300ms)
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      // Fade in and out
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

      // Try to set output device (if supported)
      if ('setSinkId' in audioContext && deviceId) {
        try {
          await (audioContext as any).setSinkId(deviceId);
        } catch (err) {
          console.warn('setSinkId not supported or failed:', err);
        }
      }

      oscillator.start(now);
      oscillator.stop(now + 0.3);

      // Wait for beep to finish before closing context
      await new Promise((resolve) => setTimeout(resolve, 350));
      await audioContext.close();
    } catch (err) {
      console.error('Error playing beep:', err);
      throw err;
    }
  }

  return {
    // State
    devices,
    selectedDeviceId,

    // Computed
    selectedDevice,

    // Actions
    setSelectedDevice,
    playTestBeep,
  };
});
