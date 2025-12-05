<template>
  <message-container>
    <template #title>{{ t('evaluation.error.title') }}</template>
    <template #main>
      <wt-icon
        icon="attention--filled" color="error"></wt-icon>
      <p>{{ t('evaluation.error.message') }}</p>
    </template>
  </message-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
