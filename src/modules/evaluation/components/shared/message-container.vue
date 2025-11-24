<template>
  <div class="message-container">
    <div class="message-container__header">
      <slot name="title"></slot>
    </div>

    <div class="message-container__main">
      <slot name="main"></slot>
    </div>
    <div class="message-container__actions">
      <slot name="actions"></slot>
    </div>

  </div>
</template>

<script setup lang="ts">
</script>
<style scoped>
.message-container {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: var(--dp-24-surface-color);
  padding: var(--spacing-sm);
  gap: var(--spacing-xs);
  border-radius: var(--spacing-xs);
}
.message-container__header {
  background-color: var(--dp-18-surface-color);
  padding: var(--spacing-xs);
  border-radius: var(--spacing-xs);
}
.message-container__main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  text-align: center;
}
</style>
