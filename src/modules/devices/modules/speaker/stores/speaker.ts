import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSpeakerStore = defineStore('speaker', () => {
    // Device list
    const devices = ref<MediaDeviceInfo[]>([]);

    // Selected device
    const selectedDeviceId = ref<string>('');

    // Computed properties
    const selectedDevice = computed(() =>
        devices.value.find((device) => device.deviceId === selectedDeviceId.value)
    );

    /**
     * Set speaker devices list
     */
    function setDevices(deviceList: MediaDeviceInfo[]): void {
        devices.value = deviceList;

        // Auto-select first device if available and none selected
        if (devices.value.length > 0 && !selectedDeviceId.value) {
            selectedDeviceId.value = devices.value[0].deviceId;
        }
    }

    /**
     * Set selected speaker
     */
    function setSelectedDevice(deviceId: string): void {
        selectedDeviceId.value = deviceId;
        console.log('Speaker changed to:', deviceId);
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
        setDevices,
        setSelectedDevice,
        playTestBeep,
    };
});

