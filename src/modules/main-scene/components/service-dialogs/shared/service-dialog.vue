<template>
    <section class="service-dialog">
        <slot />
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
.service-dialog {
    width: 100%;
    padding: var(--spacing-sm);
    background: var(--wt-page-wrapper-content-wrapper-color);
}
</style>