<template>
  <div class="speaker-settings">
    <device-select
      :device-id="selectedDeviceId"
      :options="devicesList"
      :label="t('devices.speaker')"
      @update:device-id="setPreferredDevice"
    />

    <speaker-preview
     :device-id="selectedDeviceId"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import DeviceSelect from '../../../components/device-select.vue';
import { useSpeakerStore } from '../stores/speaker';
import SpeakerPreview from './speaker-preview.vue';

const { t } = useI18n();

const speakerStore = useSpeakerStore();

const { devicesList, selectedDeviceId } = storeToRefs(speakerStore);

const { setPreferredDevice } = speakerStore;
</script>

<style scoped>
.speaker-settings {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: var(--spacing-sm);
}
</style>
