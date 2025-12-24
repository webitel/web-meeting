import { useDevicesList } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch, type ComputedRef } from "vue";
import { cleanupStream, getDeviceStreamTrack, getStreamFromDeviceId } from "../scripts/deviceUtils";


/**
 * store factory for microphone / camera devices
 */
export const createUserMediaStore = (namespace: string, { constraint }: {
    constraint: 'audio' | 'video',
}) => {
    return defineStore(namespace, () => {
        const { audioInputs, videoInputs } = useDevicesList({
            constraints: {
                [constraint]: true,
            },
        });

        const allDevicesList = computed(() => {
            return constraint === 'audio' ? audioInputs.value : videoInputs.value;
        });

		const { 
			defaultDevice, 
			deduplicatedDevicesList: devicesList,
		 } = useDefaultDevice({
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

interface UseDefaultDeviceReturn {
	defaultDevice: ComputedRef<MediaDeviceInfo | undefined>;
	/**
	 * coz "default" device is duplicated in the devices list with "default" deviceId
	 * https://webitel.atlassian.net/browse/WTEL-8378
	 */
	deduplicatedDevicesList: ComputedRef<MediaDeviceInfo[]>;
}

function useDefaultDevice({
	constraint,
	allDevicesList,
}: {
	constraint: 'audio' | 'video';
	allDevicesList: ComputedRef<MediaDeviceInfo[]>;
}): UseDefaultDeviceReturn {
    if (constraint === 'audio') {
		return useDefaultAudioDevice({ allDevicesList });
	} else {
		return useDefaultVideoDevice({ allDevicesList });
	}
}

function useDefaultAudioDevice({
	allDevicesList,
}: {
	allDevicesList: ComputedRef<MediaDeviceInfo[]>;
}): UseDefaultDeviceReturn {

	/**
	 * coz "default" device is duplicated in the devices list with "default" deviceId
	 * https://webitel.atlassian.net/browse/WTEL-8378
	 */
	const deduplicatedDevicesList = computed(() => {
		return allDevicesList.value.filter((device) => device.deviceId !== 'default');
	});

	const defaultDevice = computed(() => {
		// find default device by deviceId == 'default'
		const defaultDeviceDuplicate = allDevicesList.value.find((device) => device.deviceId === 'default');

		if (!defaultDeviceDuplicate) return allDevicesList.value.at(0); // 0-index device is the most "native" to machine => is "default" one

		// then, get it's groupId (one hardware device has same groupId for all "virtual" devices)
		const defaultGroupId = defaultDeviceDuplicate.groupId;

		// then, find and return "default" device from deviceslist by groupId
		return deduplicatedDevicesList.value.find((device) => device.groupId === defaultGroupId);
	});

	return {
		deduplicatedDevicesList,
		defaultDevice,
	};
}

function useDefaultVideoDevice({
	allDevicesList,
}: {
	allDevicesList: ComputedRef<MediaDeviceInfo[]>;
}): UseDefaultDeviceReturn {

	const deduplicatedDevicesList = computed(() => {
		return allDevicesList.value; // video has no default- duplicate, so nothing to dedupe
	});


	const defaultDevice = computed(() => {
		return allDevicesList.value.at(0); // 0-index device is the most "native" to machine => is "default" one
	});

	return {
		deduplicatedDevicesList,
		defaultDevice,
	};
}
