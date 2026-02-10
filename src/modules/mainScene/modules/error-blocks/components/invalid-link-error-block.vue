<template>
  <call-result-container>
    <template #title>{{ t('errors.invalidLink.title') }}</template>
    <template #main>
      <wt-icon
        icon="attention--filled"
        color="error"
        :size="ComponentSize.LG"
      />
      <p>{{ t('errors.invalidLink.message') }}</p>
    </template>
  </call-result-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import CallResultContainer from '../../../../evaluation/components/shared/call-result-container.vue';

const { t } = useI18n();
</script>

