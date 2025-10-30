import { ref, computed, markRaw, watch } from 'vue';
import { defineStore } from 'pinia';
import JsSIP from 'jssip';
import type { UA, WebSocketInterface } from 'jssip/lib/JsSIP';
import type { RTCSession } from 'jssip/lib/RTCSession';
import { useTimeAgo, type UseTimeAgoOptions } from '@vueuse/core';

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
    const sessionMute = ref<boolean>(false);
    const videoEnabled = ref<boolean>(false);

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

    const timeAgo = useTimeAgo(Date.now(), {
        updateInterval: 1,
    });
    watch(timeAgo, (newTimeAgo) => {
        console.log('timeAgo', newTimeAgo);
    });

    /**
     * Initialize the JsSIP User Agent
     */
    function startUserAgent(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const socket: WebSocketInterface = new JsSIP.WebSocketInterface(
                    import.meta.env.VITE_JSSIP_SERVER
                );

                // Uncomment for debugging:
                // JsSIP.debug.enable('JsSIP:*');

                const configuration = {
                    sockets: [socket],
                    uri: import.meta.env.VITE_JSSIP_URI,
                    authorization_user: import.meta.env.VITE_JSSIP_AUTHORIZATION_USER,
                    // password: import.meta.env.VITE_JSSIP_HA1,
                    realm: import.meta.env.VITE_JSSIP_REALM,
                    ha1: import.meta.env.VITE_JSSIP_HA1,
                    display_name: import.meta.env.VITE_JSSIP_DISPLAY_NAME,
                    register: false,
                    register_expires: 90,
                    session_timers: true,
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
        sessionMute.value = false;
        videoEnabled.value = false;
        session.value = null;
        sessionStartTime.value = null;

        stopNowWatcher();
        closeUserAgent();
    }

    /**
     * Make a call to a specific target
     */
    async function makeCall(target: string, options?: {
        initWithMuted?: boolean;
        withVideo?: boolean;
    }): Promise<void> {
        try {
            startNowWatcher();
            sessionState.value = SessionState.CONNECTING;

            // Set video enabled state
            videoEnabled.value = options?.withVideo ?? true;

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
                    if (videoEnabled.value) {
                        initVideo();
                    }

                    // Apply initial mute if requested
                    if (options?.initWithMuted) {
                        toggleMute(true);
                    }
                },
                muted: () => {
                    sessionMute.value = true;
                },
                unmuted: () => {
                    sessionMute.value = false;
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
                    audio: true,
                    video: true || videoEnabled.value,
                },
                sessionTimersExpires: 300,
            };

            const rtcSession = userAgent.value!.call(target, callOptions);
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

    /**
     * Toggle mute state
     */
    function toggleMute(value?: boolean): void {
        if (!session.value) return;

        // If explicit value is provided
        if (value !== undefined && typeof value === 'boolean') {
            if (value) {
                session.value.mute({ audio: true });
            } else {
                session.value.unmute({ audio: true });
            }
            return;
        }

        // Toggle based on current state
        if (session.value.isMuted().audio) {
            session.value.unmute({ audio: true });
        } else {
            session.value.mute({ audio: true });
        }
    }

    /**
     * Toggle video state
     */
    function toggleVideo(value?: boolean): void {
        if (!session.value) return;

        // If explicit value is provided
        if (value !== undefined && typeof value === 'boolean') {
            if (value) {
                session.value.unmute({ video: true });
                videoEnabled.value = true;
                initVideo();
            } else {
                session.value.mute({ video: true });
                videoEnabled.value = false;
            }
            return;
        }

        // Toggle based on current state
        if (session.value.isMuted().video) {
            session.value.unmute({ video: true });
            videoEnabled.value = true;
            initVideo();
        } else {
            session.value.mute({ video: true });
            videoEnabled.value = false;
        }
    }

    /**
     * Change microphone during active call
     */
    async function changeMicrophone(deviceId: string): Promise<void> {
        if (!session.value || !session.value.connection) {
            console.warn('No active session to change microphone');
            return;
        }

        try {
            // Get new audio stream with selected device
            const newStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: deviceId } }
            });

            const newAudioTrack = newStream.getAudioTracks()[0];

            // Find the audio sender in the peer connection
            const audioSender = session.value.connection
                .getSenders()
                .find(sender => sender.track?.kind === 'audio');

            if (audioSender && newAudioTrack) {
                // Replace the old track with the new one
                await audioSender.replaceTrack(newAudioTrack);

                // Stop the old track
                const oldTrack = audioSender.track;
                if (oldTrack) {
                    oldTrack.stop();
                }

                console.log('Microphone changed successfully to:', deviceId);
            }
        } catch (error) {
            console.error('Failed to change microphone:', error);
            throw error;
        }
    }

    /**
     * Change camera during active call
     */
    async function changeCamera(deviceId: string): Promise<void> {
        if (!session.value || !session.value.connection) {
            console.warn('No active session to change camera');
            return;
        }

        try {
            // Get new video stream with selected device
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } }
            });

            const newVideoTrack = newStream.getVideoTracks()[0];

            // Find the video sender in the peer connection
            const videoSender = session.value.connection
                .getSenders()
                .find(sender => sender.track?.kind === 'video');

            if (videoSender && newVideoTrack) {
                // Replace the old track with the new one
                await videoSender.replaceTrack(newVideoTrack);

                // Stop the old track
                const oldTrack = videoSender.track;
                if (oldTrack) {
                    oldTrack.stop();
                }

                // Update local video stream
                localVideoStream.value = newStream;

                console.log('Camera changed successfully to:', deviceId);
            }
        } catch (error) {
            console.error('Failed to change camera:', error);
            throw error;
        }
    }

    /**
     * Change speaker (audio output)
     */
    async function changeSpeaker(deviceId: string): Promise<void> {
        if (!sessionAudio.value) {
            console.warn('No audio element to change speaker');
            return;
        }

        try {
            // Use setSinkId to change the audio output device
            if ('setSinkId' in sessionAudio.value) {
                await (sessionAudio.value as any).setSinkId(deviceId);
                console.log('Speaker changed successfully to:', deviceId);
            } else {
                console.warn('setSinkId is not supported in this browser');
            }
        } catch (error) {
            console.error('Failed to change speaker:', error);
            throw error;
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
        sessionMute,
        videoEnabled,
        sessionStartTime,

        // Computed
        sessionDuration,

        // Actions
        startUserAgent,
        closeUserAgent,
        makeCall,
        hangup,
        toggleMute,
        toggleVideo,
        changeMicrophone,
        changeCamera,
        changeSpeaker,
        cleanup,
    };
});

