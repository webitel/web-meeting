<template>
    <div class="camera-settings">
      <wt-select
        :options="devicesList"
        :clearable="false"
        option-label="label"
        track-by="deviceId"
        use-value-from-options-by-prop="deviceId"
        :label="t('devices.camera')"
        :value="selectedDeviceId"
        @update:model-value="setPreferredDevice">
      </wt-select>

      <camera-preview 
        v-if="selectedDeviceId"
        :stream="deviceStream" 
        @request-stream="startSelectedDeviceStream" 
      />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onUnmounted, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CameraPreview from './camera-preview.vue';

import { useCameraStore } from '../stores/camera';

const cameraStore = useCameraStore();
const { t } = useI18n();

const { devicesList, selectedDeviceId, deviceStream } =
	storeToRefs(cameraStore);

const { startSelectedDeviceStream, stopStream, setPreferredDevice, cleanup } =
	cameraStore;

// onMounted(() => {
// startSelectedDeviceStream();
// });

/**
 * @author: @dlohvinov
 *
 * i guess won't be needed coz we'll reuse this stream for call / camera preview on "join" dialog
 */
// onUnmounted(() => {
// 	cleanup();
// });
</script>

<style scoped>
.camera-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
