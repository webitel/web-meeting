<template>
  <div class="call-result-container">
    <div class="call-result-container__header typo-subtitle-1">
      <slot name="title"></slot>
    </div>

    <div class="call-result-container__main">
      <slot name="main"></slot>
    </div>
    <div class="call-result-container__actions">
      <slot name="actions"></slot>
    </div>

  </div>
</template>

<script
  setup
  lang="ts"
>
</script>

<style
  scoped
  lang="scss"
>
.call-result-container {
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

.call-result-container__header {
  background-color: var(--dp-18-surface-color);
  padding: var(--spacing-xs);
  border-radius: var(--spacing-xs);
}

.call-result-container__main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  text-align: center;
  gap: var(--spacing-xs);
}

.call-result-container__actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;

  .wt-button {
    flex: 1;
  }
}
</style>
