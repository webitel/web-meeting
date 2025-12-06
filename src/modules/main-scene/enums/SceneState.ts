export const SceneState = {
	AllowDevicesDialog: 'allowDevicesDialog',
	JoinDialog: 'joinDialog',
	ActiveMeeting: 'activeMeeting',
} as const;

export type SceneState = (typeof SceneState)[keyof typeof SceneState];
