<template>
  <message-container>
    <template #title>{{ t('evaluation.title') }}</template>

    <template #main>
      <div class="evaluation-dialog__main">
        <div class="evaluation-dialog__message">
          <p>{{ t('evaluation.message') }}</p>
        </div>

        <wt-textarea class="evaluation-dialog__text" :placeholder="t('objects.chat.draftPlaceholder')"></wt-textarea>
      </div>
    </template>

    <template #actions>
      <div class="evaluation-dialog__actions">
        <wt-button color="success">
          <wt-icon icon="like" color="on-dark"/>
          {{t('evaluation.good')}}
        </wt-button>
        <wt-button color="error">
          <wt-icon icon="dislike" color="on-dark" />
          {{ t('evaluation.bad')}}
        </wt-button>
      </div>
    </template>
  </message-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MessageContainer from '../../evaluation/components/shared/message-container.vue';

const { t } = useI18n();
</script>

<style scoped>
.evaluation-dialog__message {
  padding: var(--spacing-sm);
  text-align: center;
  width: 100%;
}
.evaluation-dialog__actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
  .wt-button {
    flex: 1;
  }
}
.evaluation-dialog__main {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
