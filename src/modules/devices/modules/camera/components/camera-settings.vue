<template>
    <div class="camera-settings">
      <wt-select
        :value="selectedDeviceId"
        :options="devicesList"
        :label="t('devices.camera')"
        :clearable="false"
        option-label="label"
        track-by="deviceId"
        use-value-from-options-by-prop="deviceId"
        @update:model-value="setPreferredDevice"
      />

      <camera-preview
        v-if="selectedDeviceId"
        :call-stream="deviceCallStream"
      />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { ref, onUnmounted } from 'vue';

import CameraPreview from './camera-preview.vue';
import { useCameraStore } from '../stores/camera';
import { cleanupStream } from '../../../../devices/scripts/mediaStreamUtils';

const { t } = useI18n();
const cameraStore = useCameraStore();

const { devicesList, selectedDeviceId, deviceCallStream } =
	storeToRefs(cameraStore);

const { startSelectedDeviceStream, setPreferredDevice } = cameraStore;

const localStream = ref<MediaStream | null>(null);

const previewStream = computed(() => {
	return localStream.value?.clone();
});

onUnmounted(() => {
	if (localStream.value) {
		cleanupStream(localStream.value);
	}
});
</script>

<style scoped>
.camera-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
