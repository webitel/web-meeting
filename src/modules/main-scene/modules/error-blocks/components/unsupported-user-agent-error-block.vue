<template>
    <call-result-container>
      <template #title>
        {{ t('errors.unsupportedUserAgent.title') }}
      </template>
      <template #main>
        <wt-icon
          icon="attention--filled" 
          color="error"
        />
        <p>{{ t('errors.unsupportedUserAgent.message') }}</p>
      </template>
    </call-result-container>
  </template>
  
  <script setup lang="ts">
/**
 * e.g. user physical device (mobile, tablet, desktop)
 */

import { useI18n } from 'vue-i18n';

import CallResultContainer from '../../../../evaluation/components/shared/call-result-container.vue';

const { t } = useI18n();
</script>
  
