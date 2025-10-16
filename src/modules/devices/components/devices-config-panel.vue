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

        <div class="devices-config-panel__selects">
            <microphone-select v-if="hasMicrophoneAccess" v-model="selectedMicrophoneId" :devices="microphones"
                @change="setSelectedMicrophone" />

            <speaker-select v-if="hasMicrophoneAccess" v-model="selectedSpeakerId" :devices="speakers"
                @change="setSelectedSpeaker" />

            <camera-select v-if="hasCameraAccess" v-model="selectedCameraId" :devices="cameras"
                @change="setSelectedCamera" />
        </div>
    </section>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import MicrophoneSelect from '../modules/microphone/components/microphone-select.vue';
import SpeakerSelect from '../modules/speaker/components/speaker-select.vue';
import CameraSelect from '../modules/camera/components/camera-select.vue';
import { useDevicesStore } from '../stores/devices';
import { useMicrophoneStore } from '../modules/microphone/stores/microphone';
import { useSpeakerStore } from '../modules/speaker/stores/speaker';
import { useCameraStore } from '../modules/camera/stores/camera';
import { useMeetingStore } from '../../meeting/stores/meeting';
import { SessionState } from '../../meeting/stores/meeting';

const devicesStore = useDevicesStore();
const microphoneStore = useMicrophoneStore();
const speakerStore = useSpeakerStore();
const cameraStore = useCameraStore();
const meetingStore = useMeetingStore();

// Destructure state from general devices store
const { hasMicrophoneAccess, hasCameraAccess, isRequesting, error } = storeToRefs(devicesStore);

// Destructure state from individual device stores
const { devices: microphones, selectedDeviceId: selectedMicrophoneId } = storeToRefs(microphoneStore);
const { devices: speakers, selectedDeviceId: selectedSpeakerId } = storeToRefs(speakerStore);
const { devices: cameras, selectedDeviceId: selectedCameraId } = storeToRefs(cameraStore);

// Destructure meeting store state
const { sessionState, videoEnabled } = storeToRefs(meetingStore);

// Destructure actions
const { requestDeviceAccess, initializeDeviceChangeListener, cleanup } = devicesStore;
const { setSelectedDevice: setSelectedMicrophone } = microphoneStore;
const { setSelectedDevice: setSelectedSpeaker } = speakerStore;
const { setSelectedDevice: setSelectedCamera } = cameraStore;
const { changeMicrophone, changeCamera, changeSpeaker } = meetingStore;

// Watch for microphone changes and update active call
watch(selectedMicrophoneId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE) {
        try {
            await changeMicrophone(newDeviceId);
        } catch (error) {
            console.error('Failed to apply microphone change to active call:', error);
        }
    }
});

// Watch for camera changes and update active call
watch(selectedCameraId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE && videoEnabled.value) {
        try {
            await changeCamera(newDeviceId);
        } catch (error) {
            console.error('Failed to apply camera change to active call:', error);
        }
    }
});

// Watch for speaker changes and update active call
watch(selectedSpeakerId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE) {
        try {
            await changeSpeaker(newDeviceId);
        } catch (error) {
            console.error('Failed to apply speaker change to active call:', error);
        }
    }
});

// Initialize device change listener on mount
onMounted(() => {
    initializeDeviceChangeListener();
});

// Cleanup on unmount
onUnmounted(() => {
    cleanup();
});
</script>


<style scoped>
.devices-config-panel {
    --devices-config-panel-width: 320px;

    width: var(--devices-config-panel-width);
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