export const MeetingState = {
	AllowDevicesDialog: 'allowDevicesDialog',
	JoinDialog: 'joinDialog',
	ActiveMeeting: 'activeMeeting',
	CallEndedDialog: 'callEndedDialog',
} as const;

export type MeetingState = (typeof MeetingState)[keyof typeof MeetingState];
