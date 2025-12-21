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
	const { videoInputs: allDevices } = useDevicesList({
		constraints: {
			video: true,
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

	async function getSelectedDeviceStreamTrack(
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
		getSelectedDeviceStreamTrack,

		cleanup,
	};
});
