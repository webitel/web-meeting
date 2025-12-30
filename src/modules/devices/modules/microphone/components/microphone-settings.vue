<template>
    <div class="microphone-settings">
      <device-select
	      :device-id="selectedDeviceId"
        :options="devicesList"
        :label="t('devices.microphone')"
        @update:device-id="setPreferredDevice"
	  />

      <microphone-preview
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
import { useMicrophoneStore } from '../stores/microphone';
import MicrophonePreview from './microphone-preview.vue';

const microphoneStore = useMicrophoneStore();
const { t } = useI18n();

const { devicesList, selectedDeviceId, deviceStream } =
	storeToRefs(microphoneStore);

const { setPreferredDevice } = microphoneStore;
</script>

<style scoped>
.microphone-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
