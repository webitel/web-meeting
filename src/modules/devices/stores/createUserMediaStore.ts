import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	cleanupStream,
	getMediaStreamMainTrack,
	getStreamFromDeviceId,
} from '../scripts/mediaStreamUtils';
import { useDeviceSelection } from '../composables/useDeviceSelection';
import { UserMediaConstraintType } from '../enums/UserDeviceType';
import { applyVideoTrackResolution } from '../modules/camera/scripts/applyVideoTrackResolution';

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
		 * stream of the selected device, used for call
		 */
		const deviceCallStream = ref<MediaStream | null>(null);

		/**
		 * only for call, coz track is not needed for preview
		 */
		const deviceCallStreamMainTrack = computed(() => {
			if (!deviceCallStream.value) return null;

			return getMediaStreamMainTrack({
				stream: deviceCallStream.value,
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
		async function startSelectedDeviceStream({
			preview = false,
		}: {
			preview?: boolean; // should be stored in state as deviceStream (true), or just returned (false)
		} = {}): Promise<MediaStream | null> {
			// Stop any existing stream

			if (!preview && deviceCallStream.value) {
				cleanupStream(deviceCallStream.value);
			}

			if (!selectedDeviceId.value) {
				throw new Error('No Camera device selected, cant start stream');
			}

			// Get camera stream
			const newStream = await getStreamFromDeviceId({
				deviceId: selectedDeviceId.value,
				deviceType: constraint,
			});

			if (!preview) {
				deviceCallStream.value = newStream;

				if (constraint === UserMediaConstraintType.Video) {
					applyVideoTrackResolution(deviceCallStreamMainTrack.value!);
				}
			}

			return newStream;
		}

		/**
		 * Cleanup
		 */
		function cleanup() {
			if (deviceCallStream.value) {
				cleanupStream(deviceCallStream.value);
				deviceCallStream.value = null;
			}
		}

		return {
			// State
			deviceCallStream,
			prefferedDeviceId,

			// Computed
			devicesList,
			selectedDevice,
			selectedDeviceId,
			deviceCallStreamMainTrack,

			// Actions
			setPreferredDevice,
			startSelectedDeviceStream,

			cleanup,
		};
	});
};
