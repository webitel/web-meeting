import { createUserMediaStore } from '../../../stores/createUserMediaStore';

export const useMicrophoneStore = createUserMediaStore('devices/microphone', {
	constraint: 'audio',
});
