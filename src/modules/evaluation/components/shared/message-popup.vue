<template>
  <wt-popup
    :size="ComponentSize.XS"
    :closable="false"
    class="message-popup"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #main>
      <div class="message-popup__wrapper">
        <slot name="main"></slot>
      </div>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums'

</script>
<style scoped>
.message-popup__wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-2xl);
  text-align: center;
}
</style>
