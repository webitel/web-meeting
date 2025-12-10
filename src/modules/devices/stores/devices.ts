import { useDevicesList } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * General device management store
 * Handles device enumeration, permissions, and coordination between individual device stores
 */
export const useDevicesStore = defineStore('devices', () => {
	const { audioInputs, videoInputs, ensurePermissions, permissionGranted } =
		useDevicesList({
			constraints: {
				audio: true,
				video: true,
			},
		});

	const hasAnyMicrophones = computed(() => {
		return audioInputs.value.length > 0;
	});

	const hasAnyCameras = computed(() => {
		return videoInputs.value.length > 0;
	});

	const isRequesting = ref<boolean>(false);
	const error = ref<string>('');

	/**
	 * Request browser access to all devices (audio and video)
	 */
	async function requestDeviceAccess(): Promise<void> {
		isRequesting.value = true;
		error.value = '';

		try {
			// for notification only in case of failure to provide access to devices
			const result = await ensurePermissions();
			error.value = !result ? 'accessDevicesIsDenied' : '';
		} catch (err) {
			throw error.value;
		} finally {
			isRequesting.value = false;
		}
	}

	return {
		// State
		hasAnyMicrophones,
		hasAnyCameras,
		permissionGranted,
		isRequesting,
		error,

		// Actions
		requestDeviceAccess,
	};
});
