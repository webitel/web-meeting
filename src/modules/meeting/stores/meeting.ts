import { ref, computed, markRaw, inject } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import JsSIP from 'jssip';
import type { UA, WebSocketInterface } from 'jssip/lib/JsSIP';
import type { RTCSession } from 'jssip/lib/RTCSession';
import { useTimeAgo, type UseTimeAgoOptions } from '@vueuse/core';
import type { AppConfig } from '../../../types/config';
import { useAuthStore } from '../../auth/stores/auth';

/**
 * Session states for the call
 */
export enum SessionState {
    CONNECTING = 'CONNECTING',
    RINGING = 'RINGING',
    ACTIVE = 'ACTIVE',
}

/**
 * Meeting store for managing JsSIP user agent and call sessions
 */
export const useMeetingStore = defineStore('meeting', () => {
    const appConfig = inject<AppConfig>('$config')!;

    const authStore = useAuthStore();
    const { 
        xPortalDevice,
        accessToken,
        callAccount,
     } = storeToRefs(authStore);

    // User Agent
    const userAgent = ref<UA | null>(null);

    // Session
    const session = ref<RTCSession | null>(null);
    const sessionAudio = ref<HTMLAudioElement | null>(null);

    // Video streams
    const localVideoStream = ref<MediaStream | null>(null);
    const remoteVideoStream = ref<MediaStream | null>(null);

    // Session state
    const sessionState = ref<SessionState | null>(null);

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

    const microphoneEnabled = computed(() => session.value ? session.value.isMuted().audio : false);
    const videoEnabled = computed(() => session.value ? !session.value.isMuted().video : false);

    /**
     * Initialize the JsSIP User Agent
     */
    function startUserAgent(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {

                // // Uncomment for debugging:
                // JsSIP.debug.enable('JsSIP:*');

                const socket: WebSocketInterface = new JsSIP.WebSocketInterface(
                    appConfig.call.host
                );

                const configuration = {
                    sockets: [socket],
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

    /**
     * Initialize audio element for the session
     */
    function initAudio(): void {
        if (!session.value) return;

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
        if (!session.value) return;

        const receivers = session.value.connection?.getReceivers();

        if (receivers) {
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
        if (senders) {
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
            localVideoStream.value.getTracks().forEach(track => track.stop());
            localVideoStream.value = null;
        }
        if (remoteVideoStream.value) {
            remoteVideoStream.value.getTracks().forEach(track => track.stop());
            remoteVideoStream.value = null;
        }

        // Reset state
        sessionState.value = null;
        session.value = null;
        sessionStartTime.value = null;

        stopNowWatcher();
        closeUserAgent();
    }

    /**
     * Make a call to a specific target
     */
    async function makeCall(target: string, options?: {
        withAudio?: boolean;
        withVideo?: boolean;
    }): Promise<void> {
        try {
            startNowWatcher();
            sessionState.value = SessionState.CONNECTING;

            // Start user agent if not already started
            if (!userAgent.value) {
                await startUserAgent();
            }

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

                    if (!sessionAudio.value) {
                        initAudio();
                    }

                    // Initialize video streams if video is enabled
                    if (options?.withVideo) {
                        initVideo();
                    }

                    // Apply initial mute if requested
                    if (options?.withAudio === false) {
                        mute();
                    }
                },
                failed: (event: any) => {
                    console.error('Call failed:', event);
                    closeSession();
                },
                ended: () => {
                    console.log('Call ended');
                    closeSession();
                },
            };

            const callOptions = {
                eventHandlers,
                mediaConstraints: {
                    audio: options?.withAudio ?? true,
                    video: options?.withVideo ?? true,
                },
                sessionTimersExpires: 300,
            };

            // const rtcSession = userAgent.value!.call('00', callOptions);
            const rtcSession = userAgent.value!.call(appConfig.call.target, callOptions);
            session.value = rtcSession;

            // For debugging
            (window as any).jssipSession = rtcSession;

        } catch (err) {
            console.error('Failed to make call:', err);
            sessionState.value = null;
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

    function mute(): void {
        session.value!.mute({ audio: true });
    }

    function unmute(): void {
        session.value!.unmute({ audio: true });
    }

    function disableVideo(): void {
        session.value!.mute({ video: true });
    }

    function enableVideo(): void {
        session.value!.unmute({ video: true });
        initVideo();
    }

    /**
     * Toggle mute state
     */
    function toggleMute(): void {
        if (microphoneEnabled.value) {
            unmute();
        } else {
            mute();
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
            audio: { deviceId: { exact: deviceId } }
        });

        const newAudioTrack = newStream.getAudioTracks()[0];

        // Find the audio sender in the peer connection
        const audioSender = session.value!.connection
            .getSenders()
            .find(sender => sender.track?.kind === 'audio');

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
    async function changeCamera(deviceId: string) {

        // Get new video stream with selected device
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });

        const newVideoTrack = newStream.getVideoTracks()[0];

        // Find the video sender in the peer connection
        const videoSender = session.value!.connection
            .getSenders()
            .find(sender => sender.track?.kind === 'video');

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
            if ('setSinkId' in sessionAudio.value) {
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
        mute,
        unmute,
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

