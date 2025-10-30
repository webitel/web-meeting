<template>
    <div class="meeting-actions-bar">
        <slot />
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.meeting-actions-bar {
    display: flex;
    gap: var(--spacing-xs);
    background-color: var(--white);
}
</style>