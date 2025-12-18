<template>
  <call-result-container>
    <template #title>{{ t('evaluation.fail.title') }}</template>
    <template #main>
      <wt-icon
        icon="attention--filled" color="error"></wt-icon>
      <p>{{ `${t('evaluation.fail.message')}. ${t('invalidLinkMessage')}` }}</p>
    </template>
  </call-result-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CallResultContainer from '../../evaluation/components/shared/call-result-container.vue';

const { t } = useI18n();
</script>
