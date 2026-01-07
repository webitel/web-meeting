import { defineStore, storeToRefs } from 'pinia';
import { computed, watch, ref } from 'vue';

import { useDevicesPermissionsStore } from '../../devices/modules/permissions/stores/permissions';
import { useCallStore } from '../../meeting/modules/call/store/call';
import { MeetingState } from '../enums/MeetingState';

export const useMainSceneStore = defineStore('mainScene', () => {
	const devicesStore = useDevicesPermissionsStore();
	const { permissionGranted, hasAnyMicrophones, hasAnyCameras } =
		storeToRefs(devicesStore);

	const callStore = useCallStore();
	const { session } = storeToRefs(callStore);

	const alreadyCalled = ref(false);

	const shouldShowAllowDevicesDialog = computed(() => {
		return (
			!permissionGranted.value ||
			!hasAnyMicrophones.value ||
			!hasAnyCameras.value
		);
	});

	const meetingState = computed<MeetingState>(() => {
		if (session.value) {
			return MeetingState.ActiveMeeting;
		}
		if (shouldShowAllowDevicesDialog.value) {
			return MeetingState.AllowDevicesDialog;
		}
		if (alreadyCalled.value) {
			return MeetingState.CallEndedDialog;
		}
		return MeetingState.JoinDialog;
	});

	const unwatchSession = watch(session, () => {
		if (session.value) {
			alreadyCalled.value = true;
			unwatchSession();
		}
	});

	return {
		meetingState,
	};
});
