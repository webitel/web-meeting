/**
 * getUserMedia constraints type (i.e. input devices)
 * */
export const UserMediaConstraintType = {
	Audio: 'audio',
	Video: 'video',
} as const;

export type UserMediaConstraintType =
	(typeof UserMediaConstraintType)[keyof typeof UserMediaConstraintType];

/**
 * getUserMedia constraints + speaker = both input and output devices
 */
export const UserDeviceType = {
	Speaker: 'speaker',
	...UserMediaConstraintType,
} as const;

export type UserDeviceType =
	(typeof UserDeviceType)[keyof typeof UserDeviceType];
