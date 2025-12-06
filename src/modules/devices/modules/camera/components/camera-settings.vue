<template>
    <div class="camera-settings">
      <wt-select
        id="camera-select"
        :options="devices"
        :clearable="false"
        option-label="label"
        track-by="deviceId"
        :label="t('devices.camera')"
        :value="selectedDevice?.label"
        @update:model-value="setSelectedDevice">
      </wt-select>

      <video
        ref="cameraPreviewElement"
        :srcObject="stream"
        autoplay
        playsinline
        muted
        class="camera-settings__video" />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCameraStore } from '../stores/camera';

const cameraStore = useCameraStore();
const { t } = useI18n();

const { devices, selectedDevice, selectedDeviceId, stream } =
	storeToRefs(cameraStore);

const { startStream, stopStream, setSelectedDevice, cleanup } = cameraStore;

watch(
	selectedDeviceId,
	async (newDeviceId) => {
		if (stream.value) {
			stopStream();
		}

		if (!newDeviceId) return;

		await startStream();
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	cleanup();
});
</script>

<style scoped>
.camera-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.camera-settings__video {
  border-radius: var(--spacing-sm);
}
</style>
