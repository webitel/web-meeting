import { useDevicesList } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DeviceErrors } from '../../../enums/DeviceErrors';

/**
 * Handles device access and permissions for devices
 */
export const useDevicesPermissionsStore = defineStore(
	'devices/permissions',
	() => {
		const { audioInputs, videoInputs, ensurePermissions, permissionGranted } =
			useDevicesList({
				constraints: {
					audio: true,
					video: true,
				},
				requestPermissions: true,
			});

		const hasAnyMicrophones = computed(() => {
			return !!(audioInputs.value.length > 0 && audioInputs.value[0].deviceId);
		});

		const hasAnyCameras = computed(() => {
			return !!(videoInputs.value.length > 0 && videoInputs.value[0].deviceId);
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
				error.value = !result ? DeviceErrors.Denied : '';
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
	},
);
