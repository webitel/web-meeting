import { UserMediaConstraintType } from '../../../enums/UserDeviceType';
import { createUserMediaStore } from '../../../stores/createUserMediaStore';

export const useCameraStore = createUserMediaStore('devices/camera', {
	constraint: UserMediaConstraintType.Video,
});
