import { useDevicesList } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useSpeakerStore = defineStore('devices/speaker', () => {
	const { audioOutputs: allDevices } = useDevicesList({
		constraints: {
			audio: true,
		},
	});

	const devices = computed(() =>
		allDevices.value.filter((device) => device.deviceId !== 'default'),
	);

	const defaultDevice = computed(() => {
		const defaultEntry = allDevices.value.find((d) => d.deviceId === 'default');
		if (!defaultEntry) return null;

		const defaultGroupId = defaultEntry.groupId;

		return devices.value.find((d) => d.groupId === defaultGroupId) || null;
	});

	const selectedDeviceId = ref<string>('');

	const selectedDevice = computed(() =>
		devices.value.find((device) => device.deviceId === selectedDeviceId.value),
	);

	/**
	 * Set speaker devices list
	 */
	watch(
		defaultDevice,
		(newDefault) => {
			if (newDefault) {
				selectedDeviceId.value = newDefault.deviceId;
			} else if (devices.value.length > 0) {
				selectedDeviceId.value = devices.value[0].deviceId;
			}
		},
		{
			immediate: true,
		},
	);

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
