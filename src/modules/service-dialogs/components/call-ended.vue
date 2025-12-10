<template>
  <service-dialog>
    <template #title>
      {{ t('call.ended') }}
    </template>
    <template #main>
      <wt-button
        color="success"
        @click="makeCall(number, { withAudio, withVideo })"
      >{{t('call.join').toUpperCase()}}
      </wt-button>
    </template>
    <template #actions>
      <device-actions-bar
        v-model:with-audio="withAudio"
        v-model:with-video="withVideo"
      />
    </template>
  </service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DeviceActionsBar from '../../devices/components/device-actions-bar.vue';
import { useMeetingStore } from '../../meeting/stores/meeting';
import ServiceDialog from './shared/service-dialog.vue';

const { t } = useI18n();

const number = import.meta.env.DEV ? '00' : '';

const withAudio = ref<boolean>(false);
const withVideo = ref<boolean>(true);

const meetingStore = useMeetingStore();
const { makeCall } = meetingStore;
</script>

<style scoped></style>
