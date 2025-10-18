<template>
    <section class="devices-config-panel">
        <h1>Devices Config Panel</h1>

            <p v-if="error" class="error-message">
                {{ error }}
            </p>
        

            <microphone-select />

            <speaker-select />

            <camera-select />
        
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

const { hasMicrophoneAccess, hasCameraAccess, isRequesting, error } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

// Destructure state from individual device stores
const { devices: microphones, selectedDeviceId: selectedMicrophoneId } = storeToRefs(microphoneStore);
const { devices: speakers, selectedDeviceId: selectedSpeakerId } = storeToRefs(speakerStore);
const { devices: cameras, selectedDeviceId: selectedCameraId } = storeToRefs(cameraStore);

// Destructure meeting store state
const { sessionState, videoEnabled } = storeToRefs(meetingStore);

const { changeMicrophone, changeCamera, changeSpeaker } = meetingStore;

// Watch for microphone changes and update active call
watch(selectedMicrophoneId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE) {
        await changeMicrophone(newDeviceId);
    }
});

// Watch for camera changes and update active call
watch(selectedCameraId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE && videoEnabled.value) {
        await changeCamera(newDeviceId);
    }
});

// Watch for speaker changes and update active call
watch(selectedSpeakerId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE) {
        await changeSpeaker(newDeviceId);
    }
});

onMounted(async () => {
    requestDeviceAccess();
});

onUnmounted(() => {
});
</script>


<style scoped>
.devices-config-panel {
    --devices-config-panel-width: 320px;

    width: var(--devices-config-panel-width);
    background: var(--wt-page-wrapper-content-wrapper-color);
    
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
}

.error-message {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
}
</style>