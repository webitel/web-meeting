export const CallState = {
	Active: 'active',
	Finished: 'finished',
} as const;

export type CallStateType = (typeof CallState)[keyof typeof CallState];
