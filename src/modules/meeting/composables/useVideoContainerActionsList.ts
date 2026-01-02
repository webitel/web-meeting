import { computed, toRef, type MaybeRef } from 'vue';
import { VideoCallAction } from '@webitel/ui-sdk/modules/CallSession';

import { MeetingState } from '../../main-scene/enums/MeetingState';

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
		VideoCallAction.Chat,
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

	const actions = computed(() => {
		return MeetingStateToVideoActionsMap[meetingStateRef.value];
	});

	return {
		actions,
	};
};
