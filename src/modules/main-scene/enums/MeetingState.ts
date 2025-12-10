export const MeetingState = {
	AllowDevicesDialog: 'allowDevicesDialog',
	JoinDialog: 'joinDialog',
	ActiveMeeting: 'activeMeeting',
	CallEnded: 'callEnded',
} as const;

export type MeetingState = (typeof MeetingState)[keyof typeof MeetingState];
