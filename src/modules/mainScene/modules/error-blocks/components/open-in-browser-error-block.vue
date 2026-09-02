<template>
    <call-result-container>
      <template #title>
        {{ t('errors.openInBrowser.title') }}
      </template>
      <template #main>
        <wt-icon
          icon="attention--filled" 
          color="error"
        />
        <p>{{ t('errors.openInBrowser.message') }}</p>
      </template>
    </call-result-container>
  </template>
  
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import CallResultContainer from '../../../../evaluation/components/shared/call-result-container.vue';

const { t } = useI18n();
</script>
  
