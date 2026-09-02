<template>
  <div class="orientation-overlay">
    <wt-icon icon="video-call-orientation" size="6xl"></wt-icon>
    <p class="typo-heading-2">{{ t('errors.rotateDevice.message') }}</p>
  </div>  
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.orientation-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--black);
  opacity: 0.9;
}

.orientation-overlay p {
  color: var(--white);
  text-align: center;
  padding: 0 var(--spacing-sm);
}
</style>