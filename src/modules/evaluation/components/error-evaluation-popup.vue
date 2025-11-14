<template>
  <message-popup>
    <template #title>{{ t('webMeeting.evaluation.error.title') }}</template>
    <template #main>
      <wt-icon
        icon="attention--filled" color="error"></wt-icon>
      <p>{{ t('webMeeting.evaluation.error.message') }}</p>
    </template>
  </message-popup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MessagePopup from './shared/message-popup.vue'

const { t } = useI18n();
</script>
