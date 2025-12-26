import { createUserMediaStore } from '../../../stores/createUserMediaStore';

export const useCameraStore = createUserMediaStore('devices/camera', {
	constraint: 'video',
});
