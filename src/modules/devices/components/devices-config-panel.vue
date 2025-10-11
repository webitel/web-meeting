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
            <microphone-select v-model="selectedMicrophoneId" :devices="microphones" @change="setSelectedMicrophone" />

            <speaker-select v-model="selectedSpeakerId" :devices="speakers" @change="setSelectedSpeaker" />

            <camera-select v-model="selectedCameraId" :devices="cameras" @change="setSelectedCamera" />
        </div>
    </section>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import MicrophoneSelect from '../modules/microphone/components/microphone-select.vue';
import SpeakerSelect from '../modules/speaker/components/speaker-select.vue';
import CameraSelect from '../modules/camera/components/camera-select.vue';
import { useDevicesStore } from '../../../app/stores/devices';
import { useMicrophoneStore } from '../modules/microphone/stores/microphone';
import { useSpeakerStore } from '../modules/speaker/stores/speaker';
import { useCameraStore } from '../modules/camera/stores/camera';

const devicesStore = useDevicesStore();
const microphoneStore = useMicrophoneStore();
const speakerStore = useSpeakerStore();
const cameraStore = useCameraStore();

// Destructure state from general devices store
const { hasAccess, isRequesting, error } = storeToRefs(devicesStore);

// Destructure state from individual device stores
const { devices: microphones, selectedDeviceId: selectedMicrophoneId } = storeToRefs(microphoneStore);
const { devices: speakers, selectedDeviceId: selectedSpeakerId } = storeToRefs(speakerStore);
const { devices: cameras, selectedDeviceId: selectedCameraId } = storeToRefs(cameraStore);

// Destructure actions
const { requestDeviceAccess, initializeDeviceChangeListener, cleanup } = devicesStore;
const { setSelectedDevice: setSelectedMicrophone } = microphoneStore;
const { setSelectedDevice: setSelectedSpeaker } = speakerStore;
const { setSelectedDevice: setSelectedCamera } = cameraStore;

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