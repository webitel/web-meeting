<template>
  <div class="speaker-settings">
    <wt-select
      id="speaker-select"
      :options="devices"
      :clearable="false"
      option-label="label"
      track-by="deviceId"
      :label="t('devices.speaker')"
      :value="selectedDevice?.label"
      @update:model-value="setSelectedDevice($event)">
    </wt-select>

    <wt-button
      color="secondary"
      class="speaker-settings__button"
      :disabled="isPlaying"
      @click="playBeep"
    >{{ t('devices.check') }}</wt-button>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSpeakerStore } from '../stores/speaker';
import { useI18n } from 'vue-i18n'
const speakerStore = useSpeakerStore();

const { t } = useI18n();

const {
    devices,
    selectedDevice,
    selectedDeviceId,
} = storeToRefs(speakerStore);

const {
    setSelectedDevice,
    playTestBeep,
 } = speakerStore;

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
