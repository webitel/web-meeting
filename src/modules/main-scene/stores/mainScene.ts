import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useDevicesStore } from '../../devices/stores/devices';
import { useCallStore } from '../../meeting/modules/call/store/call';
import { MeetingState } from '../enums/MeetingState';

export const useMainSceneStore = defineStore('mainScene', () => {
	const devicesStore = useDevicesStore();
	const { permissionGranted } = storeToRefs(devicesStore);

	const callStore = useCallStore();
	const { session } = storeToRefs(callStore);

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
