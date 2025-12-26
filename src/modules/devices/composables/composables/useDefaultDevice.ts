import { computed, type ComputedRef } from 'vue';

interface UseDefaultDeviceReturn {
	defaultDevice: ComputedRef<MediaDeviceInfo | undefined>;
	/**
	 * coz "default" device is duplicated in the devices list with "default" deviceId
	 * https://webitel.atlassian.net/browse/WTEL-8378
	 */
	deduplicatedDevicesList: ComputedRef<MediaDeviceInfo[]>;
}

export function useDefaultDevice({
	constraint,
	allDevicesList,
}: {
	constraint: 'audio' | 'video';
	allDevicesList: ComputedRef<MediaDeviceInfo[]>;
}): UseDefaultDeviceReturn {
	if (constraint === 'audio') {
		return useDefaultAudioDevice({
			allDevicesList,
		});
	} else {
		return useDefaultVideoDevice({
			allDevicesList,
		});
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
		return allDevicesList.value.filter(
			(device) => device.deviceId !== 'default',
		);
	});

	const defaultDevice = computed(() => {
		// find default device by deviceId == 'default'
		const defaultDeviceDuplicate = allDevicesList.value.find(
			(device) => device.deviceId === 'default',
		);

		if (!defaultDeviceDuplicate) return allDevicesList.value.at(0); // 0-index device is the most "native" to machine => is "default" one

		// then, get it's groupId (one hardware device has same groupId for all "virtual" devices)
		const defaultGroupId = defaultDeviceDuplicate.groupId;

		// then, find and return "default" device from deviceslist by groupId
		return deduplicatedDevicesList.value.find(
			(device) => device.groupId === defaultGroupId,
		);
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
