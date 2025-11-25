<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-wrapper__header">

      <div class="sidebar-wrapper__title">
        <slot name="title"/>
      </div>

      <wt-icon-btn
        icon="close--filled"
        @click="emit('close')"
      ></wt-icon-btn>

    </div>


    <div class="sidebar-wrapper__main">
      <slot name="main"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);
</script>

<style scoped>
.sidebar-wrapper {
  background: var(--wt-page-wrapper-content-wrapper-color);
  width: 320px;
  padding: var(--spacing-sm);
  gap: var(--spacing-sm);
  margin: var(--spacing-sm);
  border-radius: var(--spacing-sm);
  display: flex;
  flex-direction: column;
}
.sidebar-wrapper__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-wrapper__title {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
