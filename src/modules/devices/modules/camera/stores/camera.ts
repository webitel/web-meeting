import { useDevicesList } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import {
	cleanupStream,
	getDeviceStreamTrack,
	getStreamFromDeviceId,
	getVideoTrackFromStream,
} from '../../../scripts/deviceUtils';

export const useCameraStore = defineStore('devices/camera', () => {
	const { videoInputs: devices } = useDevicesList({
		constraints: {
			video: true,
		},
	});

	const selectedDeviceId = ref<string>('');

	const stream = ref<MediaStream | null>(null);

	const selectedDevice = computed(() =>
		devices.value.find((device) => device.deviceId === selectedDeviceId.value),
	);

	watch(devices, (newDevices) => {
		const stillExists = newDevices.some(
			(device) => device.deviceId === selectedDeviceId.value,
		);

		if (stillExists) return;

		selectedDeviceId.value = newDevices[0].deviceId;
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

		// Get camera stream
		const newStream = await getStreamFromDeviceId({
			deviceId,
			deviceType: 'video',
		});

		stream.value = newStream;
		return newStream;
	}

	/**
	 * Stop camera stream
	 */
	function stopStream(): void {
		if (stream.value) {
			cleanupStream(stream.value);
			stream.value = null;
		}
	}

	async function getDeviceStreamTrack(
		deviceId: string = selectedDeviceId.value,
	) {
		return getDeviceStreamTrack(deviceId);
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
		getDeviceStreamTrack,

		cleanup,
	};
});
