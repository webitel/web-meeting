<template>
    <section class="meeting-service-dialog">
        <slot />
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
.meeting-service-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--text-contrast-color);
}
</style>
