<template>
  <div class="sidebar-content-wrapper">
    <div class="sidebar-content-wrapper__header">

      <div class="sidebar-content-wrapper__title">
        <slot name="title"/>
      </div>

      <wt-icon-btn
        icon="close--filled"
        @click="emit('close')"
      ></wt-icon-btn>

    </div>


    <div class="sidebar-content-wrapper__main">
      <slot name="main"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	close: [];
}>();
</script>

<style scoped>
.sidebar-content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sidebar-content-wrapper__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-content-wrapper__title {
  display: flex;
  gap: var(--spacing-xs);
}

.sidebar-content-wrapper__main {
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
