export const DeviceErrors = {
	Denied: 'Denied',
} as const;

export type DeviceErrors = (typeof DeviceErrors)[keyof typeof DeviceErrors];
