import { defineStore } from 'pinia';
import { useDeviceSelection } from '../../../composables/useDeviceSelection';

export const useSpeakerStore = defineStore('devices/speaker', () => {
	const {
		devicesList,
		prefferedDeviceId,
		selectedDeviceId,
		selectedDevice,
		setPreferredDevice,
	} = useDeviceSelection({
		deviceType: 'speaker',
	});

	return {
		// State
		prefferedDeviceId,

		// Computed
		devicesList,
		selectedDevice,
		selectedDeviceId,

		// Actions
		setPreferredDevice,
	};
});
