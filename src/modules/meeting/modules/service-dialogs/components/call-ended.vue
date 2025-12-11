<template>
  <meeting-service-dialog>
      {{ t('call.ended') }}

      <wt-button
        color="success"
        @click="makeCall"
      >{{t('call.join').toUpperCase()}}
      </wt-button>
  </meeting-service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { useI18n } from 'vue-i18n';
import { useCallStore } from '../../call/store/call';
import MeetingServiceDialog from './shared/meeting-service-dialog.vue';

const { t } = useI18n();

const callStore = useCallStore();
const { makeCall } = callStore;
</script>

<style scoped></style>
