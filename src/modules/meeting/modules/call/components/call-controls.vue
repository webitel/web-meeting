<template>
    <div class="call-controls">
        <div class="call-active">
            <p class="status">Status: {{ meeting.sessionState }}</p>
            <p v-if="meeting.sessionDuration" class="duration">
                Duration: {{ formatDuration(meeting.sessionDuration) }}
            </p>
            {{ meeting.remoteVideoStream }}
            {{ meeting.localVideoStream }}

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
