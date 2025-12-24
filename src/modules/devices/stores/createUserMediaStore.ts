import { useDevicesList } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import {
	cleanupStream,
	getDeviceStreamTrack,
	getStreamFromDeviceId,
} from '../scripts/deviceUtils';
import { useDefaultDevice } from '../composables/composables/useDefaultDevice';

/**
 * store factory for microphone / camera devices
 */
export const createUserMediaStore = (
	namespace: string,
	{
		constraint,
	}: {
		constraint: 'audio' | 'video';
	},
) => {
	return defineStore(namespace, () => {
		const { audioInputs, videoInputs } = useDevicesList({
			constraints: {
				[constraint]: true,
			},
		});

		const allDevicesList = computed(() => {
			return constraint === 'audio' ? audioInputs.value : videoInputs.value;
		});

		const { defaultDevice, deduplicatedDevicesList: devicesList } =
			useDefaultDevice({
				constraint,
				allDevicesList,
			});

		/**
		 * manually (!) selected deviceId to use
		 */
		const prefferedDeviceId = ref<string | null>(null);

		/**
		 * stream of the selected device
		 *
		 * used both for device preview in settings and for call
		 */
		const deviceStream = ref<MediaStream | null>(null);

		/**
		 * device that should be used for call/preview
		 *
		 * user-preferred device or "default"/fallback device in the devices list
		 */
		const selectedDevice = computed(() => {
			const prefferredDevice = devicesList.value.find(
				(device) => device.deviceId === prefferedDeviceId.value,
			);

			// if no manually selected, fallback to last device
			return prefferredDevice || defaultDevice.value;
		});

		/**
		 * id of device which should be used for call/preview
		 */
		const selectedDeviceId = computed(() => {
			return selectedDevice.value?.deviceId || null;
		});

		/**
		 * this watcher should reset prefferedDeviceId if manually selected device was ejected or not available
		 */
		watch(devicesList, (newDevicesList) => {
			if (!prefferedDeviceId.value) return;

			const hasPreviouslySelectedDevice = newDevicesList.some(
				(device) => device.deviceId === prefferedDeviceId.value,
			);

			if (!hasPreviouslySelectedDevice) {
				prefferedDeviceId.value = null;
			}
		});

		/**
		 * Set user-preferred device,
		 */
		function setPreferredDevice(
			deviceId: string,
			{
				updateStream = true,
			}: {
				updateStream?: boolean;
			} = {},
		) {
			prefferedDeviceId.value = deviceId;

			if (!updateStream) return;

			if (deviceId) {
				startSelectedDeviceStream();
			} else {
				stopStream();
			}
		}

		/**
		 * Start camera stream for testing
		 */
		async function startSelectedDeviceStream(): Promise<MediaStream | null> {
			// Stop any existing stream
			stopStream();

			if (!selectedDeviceId.value) {
				throw new Error('No Camera device selected, cant start stream');
			}

			// Get camera stream
			const newStream = await getStreamFromDeviceId({
				deviceId: selectedDeviceId.value,
				deviceType: constraint,
			});

			deviceStream.value = newStream;
			return newStream;
		}

		/**
		 * Stop ongoing device stream (if any)
		 */
		function stopStream(): void {
			if (deviceStream.value) {
				cleanupStream(deviceStream.value);
				deviceStream.value = null;
			}
		}

		async function getDeviceStreamTrack(
			deviceId: string | null = selectedDeviceId.value,
		) {
			return getDeviceStreamTrack(deviceId);
		}

		/**
		 * Cleanup
		 */
		function cleanup() {
			stopStream();
		}

		return {
			// State
			deviceStream,
			prefferedDeviceId,

			// Computed
			devicesList,
			selectedDevice,
			selectedDeviceId,

			// Actions
			setPreferredDevice,
			startSelectedDeviceStream,
			stopStream,
			// getDeviceStreamTrack,

			cleanup,
		};
	});
};
