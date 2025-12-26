import { createUserMediaStore } from '../../../stores/createUserMediaStore';
import { UserMediaConstraintType } from '../../../enums/UserDeviceType';

export const useCameraStore = createUserMediaStore('devices/camera', {
	constraint: UserMediaConstraintType.Video,
});
