import { computed, toRef, type MaybeRef } from 'vue';
import { storeToRefs } from 'pinia';
import { VideoCallAction } from '@webitel/ui-sdk/modules/CallSession';

import { MeetingState } from '../../mainScene/enums/MeetingState';
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

	const callStore = useCallStore();
	const { sessionState } = storeToRefs(callStore);

	const actions = computed(() => {
		const arrayActions = MeetingStateToVideoActionsMap[meetingStateRef.value];
		if (
			meetingStateRef.value === MeetingState.ActiveMeeting &&
			sessionState.value === SessionState.ACTIVE
		) {
			return [
				...arrayActions,
				VideoCallAction.Chat,
			];
		}
		return [
			...arrayActions,
		];
	});

	return {
		actions,
	};
};
