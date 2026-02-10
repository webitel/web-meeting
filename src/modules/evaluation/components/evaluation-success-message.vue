<template>
  <call-result-container>
    <template #title>{{ t('evaluation.success.title') }}</template>
    <template #main>
      <wt-icon
        icon="done--filled"
        color="success"
        :size="ComponentSize.LG"
      ></wt-icon>
      <p>{{ t('evaluation.success.message') }}</p>
    </template>
    </call-result-container>
  </template>

  <script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import CallResultContainer from './shared/call-result-container.vue';

const { t } = useI18n();
</script>
