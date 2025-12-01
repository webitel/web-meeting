<template>
  <!-- видалити в кінці-->
  <!--            <p v-if="error" class="error-message">-->
  <!--                {{ error }}-->
  <!--            </p>-->

  <sidebar-wrapper
    class="devices-settings-panel"
    @close="emit('close')"
  >
    <template #title>
        <wt-icon icon="settings" color="info"></wt-icon>
        <p>{{ t('devices.settings')}}</p>
    </template>

    <template #main>
      <div class="devices-settings-panel__content">
        <microphone-settings />

        <speaker-settings />

        <camera-settings />
    </div>
    </template>
  </sidebar-wrapper>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import MicrophoneSettings from '../modules/microphone/components/microphone-settings.vue';
import SpeakerSettings from '../modules/speaker/components/speaker-settings.vue';
import CameraSettings from '../modules/camera/components/camera-settings.vue';
import { useDevicesStore } from '../stores/devices';
import { useMicrophoneStore } from '../modules/microphone/stores/microphone';
import { useSpeakerStore } from '../modules/speaker/stores/speaker';
import { useCameraStore } from '../modules/camera/stores/camera';
import { useMeetingStore } from '../../meeting/stores/meeting';
import { SessionState } from '../../meeting/stores/meeting';
import SidebarWrapper from '../../sidebar/components/sidebar-wrapper.vue';

const { t } = useI18n();

const emit = defineEmits<{
  'close': [];
}>();

const devicesStore = useDevicesStore();
const microphoneStore = useMicrophoneStore();
const speakerStore = useSpeakerStore();
const cameraStore = useCameraStore();
const meetingStore = useMeetingStore();

const { permissionGranted, error } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

// Destructure state from individual device stores
const { devices: microphones, selectedDeviceId: selectedMicrophoneId } = storeToRefs(microphoneStore);
const { devices: speakers, selectedDeviceId: selectedSpeakerId } = storeToRefs(speakerStore);
const { devices: cameras, selectedDeviceId: selectedCameraId } = storeToRefs(cameraStore);

// Destructure meeting store state
const { sessionState, videoEnabled, microphoneEnabled } = storeToRefs(meetingStore);

const { changeMicrophone, changeCamera, changeSpeaker } = meetingStore;

// Watch for microphone changes and update active call
watch(selectedMicrophoneId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE && microphoneEnabled.value) {
        await changeMicrophone(newDeviceId);
    }
});

// // Watch for camera changes and update active call
watch(selectedCameraId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE && videoEnabled.value) {
        await changeCamera(newDeviceId);
    }
});

// // Watch for speaker changes and update active call
watch(selectedSpeakerId, async (newDeviceId) => {
    if (newDeviceId && sessionState.value === SessionState.ACTIVE && videoEnabled.value) {
        await changeSpeaker(newDeviceId);
    }
});

onMounted(async () => {
    if (!permissionGranted.value) {
        await requestDeviceAccess();
    }
});

onUnmounted(() => {
});
</script>


<style scoped>
.error-message {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
}

.devices-settings-panel__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
