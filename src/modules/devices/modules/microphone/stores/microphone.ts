import { useDevicesList } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useMicrophoneStore = defineStore('devices/microphone', () => {
	const { audioInputs: allDevices } = useDevicesList({
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

	const stream = ref<MediaStream | null>(null);

	const selectedDevice = computed(() =>
		devices.value.find((device) => device.deviceId === selectedDeviceId.value),
	);

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

	function setSelectedDevice(device): void {
		selectedDeviceId.value = device.deviceId ?? '';
	}

	/**
	 * Start microphone stream for testing
	 */
	async function startStream(
		deviceId: string = selectedDeviceId.value,
	): Promise<MediaStream | null> {
		// Stop any existing stream
		stopStream();

		if (!deviceId) return null;

		// Get microphone stream
		const newStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					exact: deviceId,
				},
			},
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
