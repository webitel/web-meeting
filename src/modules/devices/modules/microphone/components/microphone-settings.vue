<template>
    <div class="microphone-settings">
      <wt-select
        id="microphone-select"
        :options="devices"
        :clearable="false"
        option-label="label"
        track-by="deviceId"
        :label="t('devices.microphone')"
        :value="selectedDevice?.label"
        @update:model-value="setSelectedDevice">
      </wt-select>

      <div v-if="selectedDeviceId" class="microphone-settings__load-bar">
        <wt-load-bar max="100" :value="volumeLevel" color="info"/>
      </div>

    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMicrophoneVolume } from '../composables/useMicrophoneVolume';
import { useMicrophoneStore } from '../stores/microphone';

const microphoneStore = useMicrophoneStore();
const { t } = useI18n();

const { devices, selectedDeviceId, selectedDevice, stream } =
	storeToRefs(microphoneStore);

const { startStream, stopStream, setSelectedDevice, cleanup } = microphoneStore;

const {
	volumeLevel,
	start: startVolumeMonitoring,
	stop: stopVolumeMonitoring,
} = useMicrophoneVolume();

watch(
	selectedDeviceId,
	async (newDeviceId) => {
		if (stream.value) {
			stopStream();
			stopVolumeMonitoring();
		}

		if (!newDeviceId) return;

		await startStream();

		if (!stream.value) return;

		startVolumeMonitoring(stream.value);
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	stopVolumeMonitoring();
	cleanup();
});
</script>

<style scoped>
.microphone-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
