import { computed, ref, watch } from 'vue';
import { useDevicesList } from '@vueuse/core';

import { useDefaultDevice } from './useDefaultDevice';
import {
	UserDeviceType,
	UserMediaConstraintType,
} from '../enums/UserDeviceType';

export const useDeviceSelection = ({
	deviceType,
}: {
	deviceType: UserDeviceType;
}) => {
	const constraint =
		deviceType === UserDeviceType.Video
			? UserMediaConstraintType.Video
			: UserMediaConstraintType.Audio;

	const { audioInputs, videoInputs, audioOutputs } = useDevicesList({
		constraints: {
			[constraint]: true,
		},
	});

	const allDevicesList = computed(() => {
		switch (deviceType) {
			case UserDeviceType.Audio:
				return audioInputs.value;
			case UserDeviceType.Video:
				return videoInputs.value;
			case UserDeviceType.Speaker:
				return audioOutputs.value;
			default:
				throw new Error(`Invalid device type: ${deviceType}`);
		}
	});

	/**
	 * manually (!) selected deviceId to use
	 */
	const prefferedDeviceId = ref<string | null>(null);

	const { defaultDevice, deduplicatedDevicesList: devicesList } =
		useDefaultDevice({
			constraint,
			allDevicesList,
		});

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
	watch(allDevicesList, (newDevicesList) => {
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
	function setPreferredDevice(deviceId: string) {
		prefferedDeviceId.value = deviceId;
	}

	return {
		// state
		prefferedDeviceId,

		// computed
		devicesList,
		defaultDevice,
		selectedDevice,
		selectedDeviceId,

		setPreferredDevice,
	};
};
