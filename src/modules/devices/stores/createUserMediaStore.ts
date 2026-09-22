import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { isIOS } from '../../mainScene/scripts/isIOS';
import { useDeviceSelection } from '../composables/useDeviceSelection';
import { UserMediaConstraintType } from '../enums/UserDeviceType';
import {
	cleanupStream,
	getMediaStreamMainTrack,
	getStreamFromDeviceId,
} from '../scripts/mediaStreamUtils';

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
		const followsSystemAudioRoute =
			constraint === UserMediaConstraintType.Audio && isIOS();

		const systemDefaultDeviceId = ref<string | null>(null);

		const {
			prefferedDeviceId,
			permissionGranted,
			devicesList,
			selectedDevice,
			selectedDeviceId,
			setPreferredDevice,
		} = useDeviceSelection({
			deviceType: constraint,
			systemDefaultDeviceId,
		});

		/**
		 * stream of the selected device
		 *
		 * used ONLY for call, device preview are local!
		 */
		const deviceStream = ref<MediaStream | null>(null);

		const deviceStreamMainTrack = computed(() => {
			if (!deviceStream.value) return null;

			return getMediaStreamMainTrack({
				stream: deviceStream.value,
				deviceType: constraint,
			});
		});

		const pinnedDeviceId = computed(() => {
			if (followsSystemAudioRoute && !prefferedDeviceId.value) return null;

			return selectedDeviceId.value;
		});

		const devicesListKey = computed(() =>
			devicesList.value.map((device) => device.deviceId).join('|'),
		);

		watch(pinnedDeviceId, (newDeviceId) => {
			if (!deviceStream.value) return;

			if (newDeviceId || followsSystemAudioRoute) {
				startSelectedDeviceStream();
			} else {
				cleanup();
			}
		});

		let systemDefaultProbe: Promise<void> | null = null;

		function readStreamDeviceId(stream: MediaStream): string | null {
			const track = getMediaStreamMainTrack({
				stream,
				deviceType: constraint,
			});

			return track?.getSettings().deviceId ?? null;
		}

		function resolveSystemDefaultDeviceId(): Promise<void> {
			if (systemDefaultProbe) return systemDefaultProbe;

			systemDefaultProbe = (async () => {
				try {
					const probeStream = await getStreamFromDeviceId({
						deviceId: null,
						deviceType: constraint,
					});

					if (!probeStream) return;

					systemDefaultDeviceId.value = readStreamDeviceId(probeStream);
					cleanupStream(probeStream);
				} catch (err) {
					console.warn('Failed to resolve system default device:', err);
				} finally {
					systemDefaultProbe = null;
				}
			})();

			return systemDefaultProbe;
		}

		watch(
			[
				permissionGranted,
				devicesListKey,
			],
			() => {
				if (!followsSystemAudioRoute) return;
				if (!permissionGranted.value) return;
				if (prefferedDeviceId.value) return;

				if (deviceStream.value) {
					startSelectedDeviceStream();
				} else {
					resolveSystemDefaultDeviceId();
				}
			},
			{
				immediate: true,
			},
		);

		/**
		 * Start camera stream for testing
		 */
		async function startSelectedDeviceStream(): Promise<MediaStream | null> {
			// Stop any existing stream

			if (deviceStream.value) {
				cleanupStream(deviceStream.value);
			}

			if (!pinnedDeviceId.value && !followsSystemAudioRoute) {
				throw new Error('No Camera device selected, cant start stream');
			}

			// Get camera stream
			const newStream = await getStreamFromDeviceId({
				deviceId: pinnedDeviceId.value,
				deviceType: constraint,
			});

			deviceStream.value = newStream;

			if (newStream && followsSystemAudioRoute && !pinnedDeviceId.value) {
				systemDefaultDeviceId.value = readStreamDeviceId(newStream);
			}

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

			cleanup,
		};
	});
};
