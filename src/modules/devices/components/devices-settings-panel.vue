<template>
  <sidebar-content-wrapper
    class="devices-settings-panel"
    @close="emit('close')"
  >
    <template #title>
        <wt-icon
			icon="settings"
			color="info"
		/>
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
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import SidebarContentWrapper from '../../sidebar/components/shared/sidebar-content-wrapper.vue';
import CameraSettings from '../modules/camera/components/camera-settings.vue';
import MicrophoneSettings from '../modules/microphone/components/microphone-settings.vue';
import { useDevicesPermissionsStore } from '../modules/permissions/stores/permissions';
import SpeakerSettings from '../modules/speaker/components/speaker-settings.vue';

const { t } = useI18n();

const emit = defineEmits<{
	close: [];
}>();

const devicesStore = useDevicesPermissionsStore();

const { permissionGranted } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

onMounted(async () => {
	if (!permissionGranted.value) {
		await requestDeviceAccess(); // useful for requesting permissions after first request -> revoke
	}
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
