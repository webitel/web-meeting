import { UserMediaConstraintType } from '../../../enums/UserDeviceType';
import { createUserMediaStore } from '../../../stores/createUserMediaStore';

export const useMicrophoneStore = createUserMediaStore('devices/microphone', {
	constraint: UserMediaConstraintType.Audio,
});
