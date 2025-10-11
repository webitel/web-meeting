<template>
    <section class="devices-config-panel">
        <h1>Devices Config Panel</h1>

        <div class="devices-config-panel__controls">
            <button @click="requestDeviceAccess" :disabled="isRequesting" class="access-button">
                {{ isRequesting ? 'Requesting Access...' : 'Request Device Access' }}
            </button>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>
        </div>

        <div v-if="hasAccess" class="devices-config-panel__selects">
            <microphone-select v-model="selectedMicrophone" :devices="microphones" @change="onMicrophoneChange" />

            <speaker-select v-model="selectedSpeaker" :devices="speakers" @change="onSpeakerChange" />

            <camera-select v-model="selectedCamera" :devices="cameras" @change="onCameraChange" />
        </div>
    </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MicrophoneSelect from './microphone-select.vue';
import SpeakerSelect from './speaker-select.vue';
import CameraSelect from './camera-select.vue';

// Device lists
const microphones = ref<MediaDeviceInfo[]>([]);
const speakers = ref<MediaDeviceInfo[]>([]);
const cameras = ref<MediaDeviceInfo[]>([]);

// Selected devices
const selectedMicrophone = ref<string>('');
const selectedSpeaker = ref<string>('');
const selectedCamera = ref<string>('');

// State
const hasAccess = ref<boolean>(false);
const isRequesting = ref<boolean>(false);
const error = ref<string>('');

/**
 * Request browser access to media devices (microphone, camera)
 */
async function requestDeviceAccess(): Promise<void> {
    isRequesting.value = true;
    error.value = '';

    try {
        // Request access to audio and video
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        // Stop all tracks immediately after getting permission
        stream.getTracks().forEach(track => track.stop());

        hasAccess.value = true;

        // Enumerate devices after getting permission
        await enumerateDevices();
    } catch (err) {
        hasAccess.value = false;
        if (err instanceof Error) {
            error.value = `Failed to access devices: ${err.message}`;
        } else {
            error.value = 'Failed to access devices. Please check your permissions.';
        }
        console.error('Error requesting device access:', err);
    } finally {
        isRequesting.value = false;
    }
}

/**
 * Enumerate all available media devices
 */
async function enumerateDevices(): Promise<void> {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        microphones.value = devices.filter(device => device.kind === 'audioinput');
        speakers.value = devices.filter(device => device.kind === 'audiooutput');
        cameras.value = devices.filter(device => device.kind === 'videoinput');

        // Auto-select first device if available
        if (microphones.value.length > 0 && !selectedMicrophone.value) {
            selectedMicrophone.value = microphones.value[0].deviceId;
        }
        if (speakers.value.length > 0 && !selectedSpeaker.value) {
            selectedSpeaker.value = speakers.value[0].deviceId;
        }
        if (cameras.value.length > 0 && !selectedCamera.value) {
            selectedCamera.value = cameras.value[0].deviceId;
        }
    } catch (err) {
        error.value = 'Failed to enumerate devices';
        console.error('Error enumerating devices:', err);
    }
}

/**
 * Handle microphone selection change
 */
function onMicrophoneChange(): void {
    console.log('Microphone changed to:', selectedMicrophone.value);
    // Add your logic here to apply the new microphone
}

/**
 * Handle speaker selection change
 */
function onSpeakerChange(): void {
    console.log('Speaker changed to:', selectedSpeaker.value);
    // Add your logic here to apply the new speaker
}

/**
 * Handle camera selection change
 */
function onCameraChange(): void {
    console.log('Camera changed to:', selectedCamera.value);
    // Add your logic here to apply the new camera
}

// Listen for device changes
onMounted(() => {
    if (navigator.mediaDevices) {
        navigator.mediaDevices.addEventListener('devicechange', () => {
            if (hasAccess.value) {
                enumerateDevices();
            }
        });
    }
});
</script>


<style scoped>
.devices-config-panel {
    background: var(--wt-page-wrapper-content-wrapper-color);
    padding: 20px;
}

.devices-config-panel__controls {
    margin-bottom: 20px;
}

.access-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.access-button:hover:not(:disabled) {
    background-color: #0056b3;
}

.access-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.error-message {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
}

.devices-config-panel__selects {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>