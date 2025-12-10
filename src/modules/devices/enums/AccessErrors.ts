export const AccessErrors = {
	DevicesIsDenied: 'devicesIsDenied',
} as const;

export type AccessErrors = (typeof AccessErrors)[keyof typeof AccessErrors];
