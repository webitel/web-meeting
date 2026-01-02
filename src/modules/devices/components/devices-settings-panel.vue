<template>
  <sidebar-content-wrapper
    class="devices-settings-panel"
    @close="emit('close')"
  >
    <template #title>
        <wt-icon icon="settings" color="info"></wt-icon>
        <p>{{ t('vocabulary.settings')}}</p>
    </template>

    <template #main>
      <div class="devices-settings-panel__content">
        <microphone-settings />

        <speaker-settings />

        <camera-settings />
    </div>
    </template>
  </sidebar-content-wrapper>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
	SessionState,
	useCallStore,
} from '../../meeting/modules/call/store/call';
import SidebarContentWrapper from '../../sidebar/components/shared/sidebar-content-wrapper.vue';
import CameraSettings from '../modules/camera/components/camera-settings.vue';
import { useCameraStore } from '../modules/camera/stores/camera';
import MicrophoneSettings from '../modules/microphone/components/microphone-settings.vue';
import { useMicrophoneStore } from '../modules/microphone/stores/microphone';
import SpeakerSettings from '../modules/speaker/components/speaker-settings.vue';
import { useSpeakerStore } from '../modules/speaker/stores/speaker';
import { useDevicesPermissionsStore } from '../modules/permissions/stores/permissions';

const { t } = useI18n();

const emit = defineEmits<{
	close: [];
}>();

const devicesStore = useDevicesPermissionsStore();
const microphoneStore = useMicrophoneStore();
const speakerStore = useSpeakerStore();
const cameraStore = useCameraStore();
const callStore = useCallStore();

const { permissionGranted } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

// Destructure state from individual device stores
const { deviceStream: microphoneStream } = storeToRefs(microphoneStore);
const { deviceStream: cameraStream } = storeToRefs(cameraStore);
const { selectedDeviceId: selectedSpeakerId } = storeToRefs(speakerStore);

// Destructure meeting store state
const { sessionState, videoEnabled, microphoneEnabled } =
	storeToRefs(callStore);

const { changeMicrophone, changeCamera, changeSpeaker } = callStore;

/**
 * @author: @dlohvinov
 *
 * Watch for stream change, coz its changed with deviceId, and call store needs stream, not deviceId
 */
watch(microphoneStream, (newStream) => {
	if (
		newStream &&
		[
			SessionState.ACTIVE,
			SessionState.RINGING,
		].includes(sessionState.value!) &&
		microphoneEnabled.value
	) {
		changeMicrophone(newStream);
	}
});

/**
 * @author: @dlohvinov
 *
 * Watch for stream change, coz its changed with deviceId, and call store needs stream, not deviceId
 */
watch(cameraStream, (newStream) => {
	if (
		newStream &&
		[
			SessionState.ACTIVE,
			SessionState.RINGING,
		].includes(sessionState.value!) &&
		videoEnabled.value
	) {
		changeCamera(newStream);
	}
});

// // Watch for speaker changes and update active call
watch(selectedSpeakerId, (newDeviceId) => {
	if (
		newDeviceId &&
		[
			SessionState.ACTIVE,
			SessionState.RINGING,
		].includes(sessionState.value!) &&
		videoEnabled.value
	) {
		changeSpeaker(newDeviceId);
	}
});

onMounted(async () => {
	if (!permissionGranted.value) {
		await requestDeviceAccess();
	}
});

onUnmounted(() => {});
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
