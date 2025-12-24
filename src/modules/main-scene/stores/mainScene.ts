import { defineStore, storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useDevicesPermissionsStore } from '../../devices/modules/permissions/stores/permissions';
import {
	useCallStore,
	SessionState,
} from '../../meeting/modules/call/store/call';
import { MeetingState } from '../enums/MeetingState';

export const useMainSceneStore = defineStore('mainScene', () => {
	const devicesStore = useDevicesPermissionsStore();
	const { permissionGranted } = storeToRefs(devicesStore);

	const callStore = useCallStore();
	const { session, sessionState } = storeToRefs(callStore);

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
		if (sessionState.value === SessionState.CANCELED) {
			return MeetingState.CallEnded;
		}
		return MeetingState.JoinDialog;
	});

	return {
		meetingState,
	};
});
