<template>
    <div class="camera-settings">
      <device-select
        :device-id="selectedDeviceId"
        :options="devicesList"
        :label="t('devices.camera')"
        @update:device-id="setPreferredDevice"
      />

      <camera-preview
        v-if="selectedDeviceId"
        :device-id="selectedDeviceId"
        :stream="deviceStream"
      />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import DeviceSelect from '../../../components/device-select.vue';
import CameraPreview from './camera-preview.vue';
import { useCameraStore } from '../stores/camera';

const cameraStore = useCameraStore();
const { t } = useI18n();

const { devicesList, selectedDeviceId, deviceStream } =
	storeToRefs(cameraStore);

const { setPreferredDevice } = cameraStore;
</script>

<style scoped>
.camera-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
