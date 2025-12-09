export const SceneState = {
	AllowDevicesDialog: 'allowDevicesDialog',
	JoinDialog: 'joinDialog',
	ActiveMeeting: 'activeMeeting',
	CallEnded: 'callEnded',
} as const;

export type SceneState = (typeof SceneState)[keyof typeof SceneState];
