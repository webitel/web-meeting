import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useDevicesStore } from '../../devices/stores/devices';
import { useMeetingStore } from '../../meeting/stores/meeting';
import { MeetingState } from '../enums/MeetingState';

export const useMainSceneStore = defineStore('mainScene', () => {
	const devicesStore = useDevicesStore();
	const { permissionGranted } = storeToRefs(devicesStore);

	const meetingStore = useMeetingStore();
	const { session } = storeToRefs(meetingStore);

	const shouldShowAllowDevicesDialog = computed(() => {
		return !permissionGranted.value;
	});

	const meetingState = computed<MeetingState>(() => {
		if (session.value) {
			return MeetingState.ActiveMeeting;
		}
		if (shouldShowAllowDevicesDialog.value) {
			return MeetingState.AllowDevicesDialog;
		}
		return MeetingState.JoinDialog;
	});

	return {
		meetingState,
	};
});
