<template>
    <div class="microphone-settings">
      <wt-select
	    :value="selectedDeviceId"
        :options="devicesList"
        :label="t('devices.microphone')"
        :clearable="false"
        option-label="label"
        track-by="deviceId"
        use-value-from-options-by-prop="deviceId"
        @update:model-value="setPreferredDevice"
	  />

      <microphone-preview
		v-if="selectedDeviceId"
		:stream="deviceStream"
		@request-stream="startSelectedDeviceStream"
	  />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { onUnmounted } from 'vue';

import { useMicrophoneStore } from '../stores/microphone';
import MicrophonePreview from './microphone-preview.vue';

const microphoneStore = useMicrophoneStore();
const { t } = useI18n();

const { devicesList, selectedDeviceId, deviceStream } =
	storeToRefs(microphoneStore);

const { startSelectedDeviceStream, setPreferredDevice, cleanup } =
	microphoneStore;

/**
 * @author: @dlohvinov
 *
 * i guess won't be needed coz we'll reuse this stream for call / camera preview on "join" dialog
 */
onUnmounted(() => {
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
