import { createUserMediaStore } from '../../../stores/createUserMediaStore';
import { UserMediaConstraintType } from '../../../enums/UserDeviceType';

export const useMicrophoneStore = createUserMediaStore('devices/microphone', {
	constraint: UserMediaConstraintType.Audio,
});
