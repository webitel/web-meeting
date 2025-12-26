<template>
  <div class="speaker-settings">
    <wt-select
      :options="devices"
      :clearable="false"
      :label="t('devices.speaker')"
      :value="selectedDevice?.label"
      option-label="label"
      track-by="deviceId"
      @update:model-value="setSelectedDevice"
    />

    <wt-button
      color="secondary"
      :disabled="isPlaying"
      @click="playBeep"
    >
      {{ t('reusable.check').toUpperCase() }}
    </wt-button>

  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSpeakerStore } from '../stores/speaker';

const speakerStore = useSpeakerStore();

const { t } = useI18n();

const { devices, selectedDevice, selectedDeviceId } = storeToRefs(speakerStore);

const { setSelectedDevice, playTestBeep } = speakerStore;

const isPlaying = ref(false);

async function playBeep(): Promise<void> {
	if (isPlaying.value || !selectedDeviceId.value) return;

	try {
		isPlaying.value = true;
		await playTestBeep(selectedDeviceId.value);
	} catch (error) {
		console.error('Error playing beep:', error);
	} finally {
		isPlaying.value = false;
	}
}
</script>

<style scoped>
.speaker-settings {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: var(--spacing-sm);
}
</style>
