import JsSIP from 'jssip';
import type { UA, WebSocketInterface } from 'jssip/lib/JsSIP';
import type { RTCSession } from 'jssip/lib/RTCSession';
import { defineStore, storeToRefs } from 'pinia';
import { computed, inject, markRaw, ref } from 'vue';
import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth';
import { useCameraStore } from '../../../../devices/modules/camera/stores/camera';
import { useMicrophoneStore } from '../../../../devices/modules/microphone/stores/microphone';

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

	// User Agent
	const userAgent = ref<UA | null>(null);

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

	// Session timing
	const sessionStartTime = ref<Date | null>(null);
	const now = ref<number>(Date.now());
	let nowInterval: ReturnType<typeof setInterval> | null = null;

	// Computed
	const sessionDuration = computed(() => {
		if (!sessionStartTime.value) return null;
		const duration = now.value - sessionStartTime.value.getTime();
		return duration < 0 ? 0 : duration;
	});

	const microphoneEnabled = computed(() =>
		session.value
			? !session.value.isMuted().audio
			: initCallWithMicrophone.value,
	);
	const videoEnabled = computed(() =>
		session.value ? !session.value.isMuted().video : initCallWithVideo.value,
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
				}
			});
			localVideoStream.value = localStream;
		}
	}

	/**
	 * Start the reactive now watcher for session duration
	 */
	function startNowWatcher(): void {
		if (nowInterval) return;

		now.value = Date.now();
		nowInterval = setInterval(() => {
			now.value = Date.now();
		}, 1000);
	}

	/**
	 * Stop the reactive now watcher
	 */
	function stopNowWatcher(): void {
		if (nowInterval) {
			clearInterval(nowInterval);
			nowInterval = null;
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
		sessionStartTime.value = null;

		stopNowWatcher();
		closeUserAgent();
	}

	/**
	 * Make a call to a specific target
	 */
	async function makeCall(options?: {
		withAudio?: boolean;
		withVideo?: boolean;
	}): Promise<void> {
		const startWithAudio = options?.withAudio ?? initCallWithMicrophone.value;
		const startWithVideo = options?.withVideo ?? initCallWithVideo.value;

		try {
			startNowWatcher();
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

			callMediaStream.value!.addTrack(cameraStreamTrack.value); // todo: handle error if no track
			callMediaStream.value!.addTrack(microphoneStreamTrack.value); // todo: handle error if no track

			// window.attachVideo = async () => {
			// await startCameraStream();
			// if (cameraStream.value) {
			// changeCamera();
			// }
			// };

			// if (!cameraStream.value) {
			// 	await startCameraStream();
			// }

			const eventHandlers = {
				progress: () => {
					// Call is ringing
					console.log('Call progress (ringing)');
					sessionState.value = SessionState.RINGING;
					initAudio();
				},
				confirmed: () => {
					// Call is confirmed (200 OK)
					console.log('Call confirmed');
					sessionState.value = SessionState.ACTIVE;
					sessionStartTime.value = new Date();

					initAudio();
					initVideo();

					// apply initial video mute if requested
					if (!startWithVideo) {
						disableVideo();
					}

					// apply initial audio mute if requested
					if (!startWithAudio) {
						disableMicrophone();
					}
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
				sessionTimersExpires: 300,
			};

			// const rtcSession = userAgent.value!.call('00', callOptions);
			const rtcSession = userAgent.value!.call(
				appConfig.call.target,
				callOptions,
			);
			session.value = rtcSession;

			// For debugging
			(window as any).jssipSession = rtcSession;
		} catch (err) {
			console.error('Failed to make call:', err);
			sessionState.value = SessionState.FAILED;
			throw err;
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

	window.addEventListener('beforeunload', () => {
		hangup();
	});

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
	async function changeMicrophone(deviceId: string) {
		// Get new audio stream with selected device
		const newStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					exact: deviceId,
				},
			},
		});

		const newAudioTrack = newStream.getAudioTracks()[0];

		// Find the audio sender in the peer connection
		const audioSender = session
			.value!.connection.getSenders()
			.find((sender) => sender.track?.kind === 'audio');

		const oldTrack = audioSender?.track;

		if (audioSender && newAudioTrack) {
			// Replace the old track with the new one
			await audioSender.replaceTrack(newAudioTrack);

			// Stop the old track
			oldTrack?.stop();
		}
	}

	/**
	 * Change camera during active call
	 */
	async function changeCamera(deviceId: string = '') {
		// Get new video stream with selected device
		// const newStream = await navigator.mediaDevices.getUserMedia({
		// 	video: {
		// 		deviceId: {
		// 			exact: deviceId,
		// 		},
		// 	},
		// });

		const newStream = cameraStream.value!;

		const newVideoTrack = newStream.getVideoTracks()[0];

		// Find the video sender in the peer connection
		const videoSender = session
			.value!.connection.getSenders()
			.find((sender) => sender.track?.kind === 'video');

		const oldTrack = videoSender?.track;

		if (videoSender && newVideoTrack) {
			// Replace the old track with the new one
			await videoSender.replaceTrack(newVideoTrack);

			// Update local video stream
			localVideoStream.value = newStream;

			// Stop the old track
			oldTrack?.stop();
		}
	}

	/**
	 * Change speaker (audio output)
	 */
	async function changeSpeaker(deviceId: string) {
		// Use setSinkId to change the audio output device
		if (sessionAudio.value && 'setSinkId' in sessionAudio.value) {
			await (sessionAudio.value as any).setSinkId(deviceId);
		} else {
			console.warn('setSinkId is not supported in this browser');
		}
	}

	/**
	 * Cleanup store
	 */
	function cleanup(): void {
		if (session.value) {
			hangup();
		}
		closeUserAgent();
		stopNowWatcher();
	}

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
		sessionStartTime,

		// Computed
		sessionDuration,

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
