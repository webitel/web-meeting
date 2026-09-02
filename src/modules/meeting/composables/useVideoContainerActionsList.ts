import { VideoCallAction } from '@webitel/ui-sdk/modules/CallSession';
import { storeToRefs } from 'pinia';
import { computed, type MaybeRef, toRef } from 'vue';

import { useDevicesPermissionsStore } from '../../devices/modules/permissions/stores/permissions';
import { MeetingState } from '../../mainScene/enums/MeetingState';
import { isMobile } from '../../mainScene/scripts/isMobile';
import { SessionState, useCallStore } from '../modules/call/store/call';

const MeetingStateToVideoActionsMap: Record<MeetingState, VideoCallAction[]> = {
	[MeetingState.AllowDevicesDialog]: [
		VideoCallAction.Mic,
		VideoCallAction.Video,
		VideoCallAction.Settings,
	],
	[MeetingState.JoinDialog]: [
		VideoCallAction.Mic,
		VideoCallAction.Video,
		VideoCallAction.Settings,
	],
	[MeetingState.ActiveMeeting]: [
		VideoCallAction.Mic,
		VideoCallAction.Video,
		VideoCallAction.Settings,
		VideoCallAction.Hangup,
	],
	[MeetingState.CallEndedDialog]: [
		VideoCallAction.Mic,
		VideoCallAction.Video,
		VideoCallAction.Settings,
	],
};

export const useVideoContainerActionsList = ({
	meetingState,
}: {
	meetingState: MaybeRef<MeetingState>;
}) => {
	const meetingStateRef = toRef(meetingState);

	const isMobileDevice = isMobile();
	const callStore = useCallStore();
	const devicesStore = useDevicesPermissionsStore();
	const { sessionState } = storeToRefs(callStore);
	const { hasMultipleCameras } = storeToRefs(devicesStore);
	const { videoEnabled } = storeToRefs(callStore);

	const actions = computed(() => {
		const base = MeetingStateToVideoActionsMap[meetingStateRef.value];

		const arrayActions = [
			...base,
		];

		if (
			meetingStateRef.value === MeetingState.ActiveMeeting &&
			sessionState.value === SessionState.ACTIVE
		) {
			arrayActions.push(VideoCallAction.Chat);
		}

		if (
			isMobileDevice &&
			meetingStateRef.value === MeetingState.ActiveMeeting &&
			hasMultipleCameras.value &&
			videoEnabled.value
		) {
			arrayActions.push(VideoCallAction.FlipCamera);
		}

		if (isMobileDevice) {
			return arrayActions.filter(
				(action) => action !== VideoCallAction.Settings,
			);
		}

		return arrayActions;
	});

	return {
		actions,
	};
};
