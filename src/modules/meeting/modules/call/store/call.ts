import JsSIP from 'jssip';
import type { UA, WebSocketInterface } from 'jssip/lib/JsSIP';
import type { RTCSession } from 'jssip/lib/RTCSession';
import { defineStore, storeToRefs } from 'pinia';
import { computed, inject, markRaw, ref } from 'vue';

import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth';
import { useCameraStore } from '../../../../devices/modules/camera/stores/camera';
import { useMicrophoneStore } from '../../../../devices/modules/microphone/stores/microphone';
import { useSpeakerStore } from '../../../../devices/modules/speaker/stores/speaker';
import { UserMediaConstraintType } from '../../../../devices/enums/UserDeviceType';
import { forceSenderVideoHighQuality } from '../scripts/forceSenderVideoHighQuality';

/**
 * Session states for the call
 */
export enum SessionState {
	CONNECTING = 'CONNECTING',
	RINGING = 'RINGING',
	ACTIVE = 'ACTIVE',

	CANCELED = 'CANCELED', // cancellation until the call is accepted
	COMPLETED = 'COMPLETED', // successful call ending after conversation
	FAILED = 'FAILED', // an error occurred
}

/**
 * Meeting store for managing JsSIP user agent and call sessions
 */
export const useCallStore = defineStore('meeting/call', () => {
	const appConfig = inject<AppConfig>('$config')!;

	const authStore = useAuthStore();
	const { xPortalDevice, meetingId, accessToken, callAccount } =
		storeToRefs(authStore);

	const microphoneStore = useMicrophoneStore();
	const { deviceStreamMainTrack: microphoneStreamTrack } =
		storeToRefs(microphoneStore);
	const { startSelectedDeviceStream: startMicrophoneStream } = microphoneStore;

	const cameraStore = useCameraStore();
	const { deviceStreamMainTrack: cameraStreamTrack } = storeToRefs(cameraStore);
	const { startSelectedDeviceStream: startCameraStream } = cameraStore;

	const speakerStore = useSpeakerStore();
	const { selectedDeviceId: speakerDeviceId } = storeToRefs(speakerStore);

	// User Agent
	const userAgent = ref<UA | null>(null);

	const isStartingCall = ref(false);

	// Session
	const session = ref<RTCSession | null>(null);
	const sessionAudio = ref<HTMLAudioElement | null>(null);

	// Video streams
	const localVideoStream = ref<MediaStream | null>(null);
	const remoteVideoStream = ref<MediaStream | null>(null);

	const initCallWithMicrophone = ref<boolean>(true);
	const initCallWithVideo = ref<boolean>(true);

	// Session state
	const sessionState = ref<SessionState | null>(null);

	const callMediaStream = ref<MediaStream | null>(null);

	const isSessionStateFinished = computed(
		() =>
			sessionState.value === SessionState.COMPLETED ||
			sessionState.value === SessionState.CANCELED ||
			sessionState.value === SessionState.FAILED,
	);

	const microphoneEnabled = computed(() => {
		// https://webitel.atlassian.net/browse/WTEL-8385
		if (
			[
				SessionState.ACTIVE,
				SessionState.RINGING,
			].includes(sessionState.value!)
		) {
			return !session.value?.isMuted().audio;
		}
		return initCallWithMicrophone.value;
	});

	const videoEnabled = computed(() => {
		// https://webitel.atlassian.net/browse/WTEL-8385
		if (
			[
				SessionState.ACTIVE,
				SessionState.RINGING,
			].includes(sessionState.value!)
		) {
			return !session.value?.isMuted().video;
		}
		return initCallWithVideo.value;
	});

	const remoteVideoActive = computed(() => {
		if (!session.value?.connection) return false;

		return session.value.connection.getReceivers().some((receiver) => {
			const track = receiver.track;
			return (
				track &&
				track.kind === 'video' &&
				track.readyState === 'live' &&
				track.enabled
			);
		});
	});

	const hasAnyVideoStream = computed(
		() => remoteVideoActive.value || videoEnabled.value,
	);

	/**
	 * Initialize the JsSIP User Agent
	 */
	function startUserAgent(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				// // Uncomment for debugging:
				// JsSIP.debug.enable('JsSIP:*');

				const socket: WebSocketInterface = new JsSIP.WebSocketInterface(
					appConfig.call.host,
				);

				const configuration = {
					sockets: [
						socket,
					],
					authorization_user: xPortalDevice.value,
					uri: `sip:${callAccount.value!.userId}@${callAccount.value!.realm}`,
					realm: callAccount.value!.realm,
					password: accessToken.value!,
					register: false,
				};

				const ua = new JsSIP.UA(configuration);
				ua.start();

				/**
				 * @author: @dlohvinov
				 *
				 * dont remove "markRaw" here!!
				 * coz najibnetsya
				 */
				userAgent.value = markRaw(ua);

				// Handle beforeunload to cleanup
				window.addEventListener('beforeunload', async () => {
					await closeUserAgent();
				});

				ua.on('connected', () => {
					console.log('JsSIP User Agent connected');
					resolve();
				});

				ua.on('disconnected', () => {
					console.warn('JsSIP User Agent disconnected');
				});

				ua.on('registrationFailed', (event) => {
					console.error('JsSIP registration failed:', event);
					reject(new Error('Registration failed'));
				});
			} catch (err) {
				console.error('Failed to start User Agent:', err);
				reject(err);
			}
		});
	}

	/**
	 * Close the JsSIP User Agent
	 */
	function closeUserAgent(): void {
		if (userAgent.value) {
			userAgent.value.stop();
			userAgent.value = null;
		}
	}

	function createCallMediaStream() {
		if (callMediaStream.value) {
			clearCallMediaStream();
		}

		const stream = new MediaStream();
		callMediaStream.value = stream;

		return stream;
	}

	function clearCallMediaStream() {
		if (callMediaStream.value) {
			callMediaStream.value.getTracks().forEach((track) => track.stop());
			callMediaStream.value = null;
		}
	}

	/**
	 * Initialize audio element for the session
	 */
	function initAudio(): void {
		if (!session.value || sessionAudio.value) return;

		const audio = new Audio();
		audio.autoplay = true;

		const stream = new MediaStream();
		const receivers = session.value.connection?.getReceivers();

		if (receivers && receivers.length > 0 && receivers[0]?.track) {
			stream.addTrack(receivers[0].track);
		}

		audio.srcObject = stream;
		sessionAudio.value = audio;
		changeSpeaker(speakerDeviceId.value!);
	}

	/**
	 * Initialize video streams for the session
	 */
	function initVideo(): void {
		if (!session.value || localVideoStream.value) return;

		const receivers = session.value.connection?.getReceivers();

		if (receivers && !remoteVideoStream.value) {
			// Create remote video stream from received tracks
			const remoteStream = new MediaStream();
			receivers.forEach((receiver) => {
				if (receiver.track && receiver.track.kind === 'video') {
					remoteStream.addTrack(receiver.track);
				}
			});
			remoteVideoStream.value = remoteStream;
		}

		// Get local stream from senders
		const senders = session.value.connection?.getSenders();
		if (senders && !localVideoStream.value) {
			const localStream = new MediaStream();
			senders.forEach((sender) => {
				if (sender.track && sender.track.kind === 'video') {
					localStream.addTrack(sender.track);
					forceSenderVideoHighQuality(sender);
				}
			});
			localVideoStream.value = localStream;
		}
	}

	/**
	 * Close the current session
	 */
	function closeSession(): void {
		// Cleanup audio
		if (sessionAudio.value) {
			sessionAudio.value.srcObject = null;
			sessionAudio.value = null;
		}

		// Cleanup video streams
		if (localVideoStream.value) {
			localVideoStream.value.getTracks().forEach((track) => track.stop());
			localVideoStream.value = null;
		}
		if (remoteVideoStream.value) {
			remoteVideoStream.value.getTracks().forEach((track) => track.stop());
			remoteVideoStream.value = null;
		}

		// Reset state
		session.value = null;

		closeUserAgent();
	}

	/**
	 * Make a call to a specific target
	 */
	async function makeCall(options?: {
		withAudio?: boolean;
		withVideo?: boolean;
	}): Promise<void> {
		isStartingCall.value = true;

		const startWithAudio = options?.withAudio ?? initCallWithMicrophone.value;
		const startWithVideo = options?.withVideo ?? initCallWithVideo.value;

		try {
			sessionState.value = SessionState.CONNECTING;

			// Start user agent if not already started
			if (!userAgent.value) {
				await startUserAgent();
			}

			createCallMediaStream();

			await Promise.all([
				startCameraStream(),
				startMicrophoneStream(),
			]);

			// values are "!" coz tracks should be initialized after startCameraStream() and startMicrophoneStream()
			callMediaStream.value!.addTrack(cameraStreamTrack.value!);
			callMediaStream.value!.addTrack(microphoneStreamTrack.value!);

			const eventHandlers = {
				progress: () => {
					// Call is ringing
					console.log('1: Call progress (ringing)');

					initAudio();
					initVideo();

					/**
					 * @author: dlohvinov
					 * initial mute should be applied before call is confirmed,
					 * @see https://webitel.atlassian.net/browse/WTEL-8385
					 */
					// apply initial video mute if requested
					if (!startWithVideo) {
						disableVideo();
					}

					// apply initial audio mute if requested
					if (!startWithAudio) {
						disableMicrophone();
					}
					sessionState.value = SessionState.RINGING;
				},

				confirmed: () => {
					// Call is confirmed (200 OK)
					console.log('2: Call confirmed');
					sessionState.value = SessionState.ACTIVE;
				},
				failed: (event: any) => {
					console.error('Call failed:', event);
					sessionState.value = SessionState.FAILED;
					closeSession();
					clearCallMediaStream();
				},
				ended: () => {
					console.log('Call ended');
					if (sessionState.value === SessionState.ACTIVE) {
						sessionState.value = SessionState.COMPLETED;
					} else sessionState.value = SessionState.CANCELED;
					closeSession();
					clearCallMediaStream();
				},
			};

			const callOptions = {
				eventHandlers,
				mediaConstraints: {
					audio: true,
					video: true,
				},
				mediaStream: callMediaStream.value!,
				extraHeaders: [
					`X-Webitel-Meeting: ${meetingId.value}`,
				],
				sessionTimersExpires: 120, // https://webitel.atlassian.net/browse/WTEL-8364
			};

			const rtcSession = userAgent.value!.call(
				appConfig.call.target,
				callOptions,
			);
			session.value = rtcSession;
			(window as any).currentCallRTCSession = rtcSession; // For debugging
		} catch (err) {
			console.error('Failed to make call:', err);
			sessionState.value = SessionState.FAILED;
			throw err;
		} finally {
			isStartingCall.value = false;
		}
	}

	/**
	 * Hangup the current call
	 */
	function hangup(): void {
		if (session.value) {
			session.value.terminate();
		}
	}

	function enableMicrophone(): void {
		if (!session.value) {
			initCallWithMicrophone.value = true;
		} else {
			session.value!.unmute({
				audio: true,
			});
		}
	}

	function disableMicrophone(): void {
		if (!session.value) {
			initCallWithMicrophone.value = false;
		} else {
			session.value!.mute({
				audio: true,
			});
		}
	}

	function disableVideo(): void {
		if (!session.value) {
			initCallWithVideo.value = false;
		} else {
			session.value!.mute({
				video: true,
			});
		}
	}

	function enableVideo(): void {
		if (!session.value) {
			initCallWithVideo.value = true;
		} else {
			session.value!.unmute({
				video: true,
			});
			initVideo();
		}
	}

	/**
	 * Toggle mute state
	 */
	function toggleMute(): void {
		if (microphoneEnabled.value) {
			disableMicrophone();
		} else {
			enableMicrophone();
		}
	}

	/**
	 * Toggle video state
	 */
	function toggleVideo(): void {
		if (videoEnabled.value) {
			disableVideo();
		} else {
			enableVideo();
		}
	}

	/**
	 * Change microphone during active call
	 */
	function changeMicrophone(newStream: MediaStream) {
		/**
		 * @author: dlohvinov
		 *
		 * not sure if newStream param is needed,
		 * if stream track is used from device store
		 */
		return changeUserMediaDevice({
			stream: newStream,
			track: microphoneStreamTrack.value!,
			constraint: UserMediaConstraintType.Audio,
		});
	}

	/**
	 * Change camera during active call
	 */
	function changeCamera(newStream: MediaStream) {
		/**
		 * @author: dlohvinov
		 *
		 * not sure if newStream param is needed,
		 * if stream track is used from device store
		 */
		return changeUserMediaDevice({
			stream: newStream,
			track: cameraStreamTrack.value!,
			constraint: UserMediaConstraintType.Video,
		});
	}

	async function changeUserMediaDevice({
		stream: newStream,
		track: newTrack,
		constraint,
	}: {
		stream: MediaStream;
		track: MediaStreamTrack;
		constraint: UserMediaConstraintType;
	}) {
		// Find the sender in the peer connection
		const constraintSender = session
			.value!.connection.getSenders()
			.find((sender) => sender.track?.kind === constraint);

		if (!constraintSender) {
			throw new Error(`No ${constraint} sender found for call`);
		}

		const oldTrack = constraintSender.track;
		newTrack.enabled = oldTrack?.enabled ?? true; // preserve mute state while changing device track

		// Replace the old track with the new one
		await constraintSender.replaceTrack(newTrack);

		if (constraint === UserMediaConstraintType.Video) {
			// Update local video stream
			localVideoStream.value = newStream;
		}

		// Stop the old track
		oldTrack?.stop();
	}

	/**
	 * Change speaker (audio output)
	 */
	async function changeSpeaker(deviceId: string) {
		// Use setSinkId to change the audio output device
		await (sessionAudio.value as HTMLAudioElement).setSinkId(deviceId);
	}

	function cleanup() {
		if (session.value) {
			hangup();
		}
		closeUserAgent();
	}

	// coz hangup ends server connection
	window.addEventListener('beforeunload', () => {
		hangup();
	});

	return {
		// State
		userAgent,
		session,
		sessionAudio,
		localVideoStream,
		remoteVideoStream,
		sessionState,
		microphoneEnabled,
		videoEnabled,
		isStartingCall,

		// Computed
		isSessionStateFinished,
		hasAnyVideoStream,

		// Actions
		startUserAgent,
		closeUserAgent,
		makeCall,
		hangup,
		enableMicrophone,
		disableMicrophone,
		disableVideo,
		enableVideo,
		toggleMute,
		toggleVideo,
		changeMicrophone,
		changeCamera,
		changeSpeaker,
		cleanup,
	};
});
