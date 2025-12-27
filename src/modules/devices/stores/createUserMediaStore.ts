import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	cleanupStream,
	getMediaStreamMainTrack,
	getStreamFromDeviceId,
} from '../scripts/mediaStreamUtils';
import { useDeviceSelection } from '../composables/useDeviceSelection';
import { UserMediaConstraintType } from '../enums/UserDeviceType';

/**
 * store factory for microphone / camera devices
 */
export const createUserMediaStore = (
	namespace: string,
	{
		constraint,
	}: {
		constraint: UserMediaConstraintType;
	},
) => {
	return defineStore(namespace, () => {
		const {
			prefferedDeviceId,
			devicesList,
			selectedDevice,
			selectedDeviceId,
			setPreferredDevice: setPreferredDeviceSelection,
		} = useDeviceSelection({
			deviceType: constraint,
		});

		/**
		 * stream of the selected device
		 *
		 * used both for device preview in settings and for call
		 */
		const deviceStream = ref<MediaStream | null>(null);

		const deviceStreamMainTrack = computed(() => {
			if (!deviceStream.value) return null;

			return getMediaStreamMainTrack({
				stream: deviceStream.value,
				deviceType: constraint,
			});
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
			setPreferredDeviceSelection(deviceId);

			if (!updateStream) return;

			if (deviceId) {
				startSelectedDeviceStream();
			} else {
				cleanup();
			}
		}

		/**
		 * Start camera stream for testing
		 */
		async function startSelectedDeviceStream(): Promise<MediaStream | null> {
			// Stop any existing stream

			if (deviceStream.value) {
				cleanupStream(deviceStream.value);
			}

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
		 * Cleanup
		 */
		function cleanup() {
			if (deviceStream.value) {
				cleanupStream(deviceStream.value);
				deviceStream.value = null;
			}
		}

		return {
			// State
			deviceStream,
			prefferedDeviceId,

			// Computed
			devicesList,
			selectedDevice,
			selectedDeviceId,
			deviceStreamMainTrack,

			// Actions
			setPreferredDevice,
			startSelectedDeviceStream,
			// getDeviceStreamTrack,

			cleanup,
		};
	});
};
