<template>
    <div class="call-controls">
        <div v-if="meeting.sessionState === SessionState.IDLE" class="call-setup">
            <input v-model="callTarget" type="text" placeholder="Enter SIP URI (e.g., sip:100@domain.com)" />
            <div class="options">
                <label>
                    <input v-model="withVideo" type="checkbox" />
                    Enable video
                </label>
            </div>
            <button @click="handleMakeCall" class="call-button">Make Call</button>
        </div>

        <div v-else class="call-active">
            <p class="status">Status: {{ meeting.sessionState }}</p>
            <p v-if="meeting.sessionDuration" class="duration">
                Duration: {{ formatDuration(meeting.sessionDuration) }}
            </p>
            {{ meeting.remoteVideoStream }}
            {{ meeting.localVideoStream }}

            <!-- Video containers -->
            <div v-if="meeting.videoEnabled" class="video-container" style="width: 1000px;">
                <div class="video-wrapper remote-video">
                    <video ref="remoteVideoEl" :srcObject.prop="meeting.remoteVideoStream" autoplay playsinline />
                    <span class="video-label">Remote</span>
                </div>
                <div class="video-wrapper local-video">
                    <video ref="localVideoEl" :srcObject.prop="meeting.localVideoStream" autoplay playsinline muted />
                    <span class="video-label">You</span>
                </div>
            </div>

            <!-- Call controls -->
            <div class="controls">
                <button @click="meeting.toggleMute()" :class="{ active: meeting.sessionMute }">
                    {{ meeting.sessionMute ? '🔇 Unmute' : '🎤 Mute' }}
                </button>
                <button v-if="meeting.videoEnabled" @click="meeting.toggleVideo()"
                    :class="{ active: !meeting.videoEnabled }">
                    {{ meeting.videoEnabled ? '📹 Video On' : '📹 Video Off' }}
                </button>
                <button @click="meeting.hangup()" class="hangup">
                    📞 Hangup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMeetingStore } from '../../../stores/meeting';
import { SessionState } from '../../../stores/meeting';

const meeting = useMeetingStore();
const callTarget = ref('00');
const withVideo = ref(true);

const localVideoEl = ref<HTMLVideoElement | null>(null);
const remoteVideoEl = ref<HTMLVideoElement | null>(null);

// Watch for local video stream changes
// watch(() => meeting.localVideoStream, (stream) => {
//     if (localVideoEl.value && stream) {
//         localVideoEl.value.srcObject = stream;
//     }
// });

// // Watch for remote video stream changes
// watch(() => meeting.remoteVideoStream, (stream) => {
//     if (remoteVideoEl.value && stream) {
//         remoteVideoEl.value.srcObject = stream;
//     }
// });

async function handleMakeCall() {
    try {
        await meeting.makeCall(callTarget.value, {
            initWithMuted: false,
            withVideo: withVideo.value,
        });
    } catch (error) {
        console.error('Failed to make call:', error);
        alert('Failed to make call. Check console for details.');
    }
}

function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const displaySeconds = seconds % 60;
    const displayMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    }
    return `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.call-controls {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.call-setup {
    text-align: center;
}

input[type="text"] {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
}

.options {
    margin-bottom: 15px;
}

.options label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
}

.options input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

button {
    padding: 12px 24px;
    margin: 5px;
    border: none;
    border-radius: 8px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #45a049;
}

button.call-button {
    width: 100%;
    padding: 16px;
    font-size: 18px;
}

button.hangup {
    background-color: #f44336;
}

button.hangup:hover {
    background-color: #da190b;
}

button.active {
    background-color: #ff9800;
}

button.active:hover {
    background-color: #e68900;
}

.call-active {
    text-align: center;
}

.status {
    font-size: 18px;
    font-weight: 600;
    margin: 10px 0;
    color: #4caf50;
}

.duration {
    font-size: 24px;
    font-weight: 700;
    margin: 15px 0;
    color: #333;
}

.video-container {
    position: relative;
    margin: 20px 0;
    background-color: #000;
    border-radius: 12px;
    overflow: hidden;
}

.video-wrapper {
    position: relative;
}

.video-wrapper.remote-video {
    width: 100%;
    aspect-ratio: 16/9;
    background-color: #1a1a1a;
}

.video-wrapper.local-video {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 200px;
    aspect-ratio: 4/3;
    background-color: #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-label {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.controls {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.controls button {
    min-width: 120px;
}
</style>
