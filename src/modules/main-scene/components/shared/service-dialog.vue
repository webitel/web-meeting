<template>
    <section class="service-dialog">
        <header class="service-dialog__header">
            <slot name="header">
                <h2 class="service-dialog__title">
                    <slot name="title" />
                </h2>
            </slot> 
        </header>
        <main class="service-dialog__main">
            <slot />
        </main>
        <footer class="service-dialog__footer">
            <slot name="footer">
                <div class="service-dialog__actions">
                    <slot name="actions" />
                </div>
            </slot>
        </footer>
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
.service-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm);
    background: var(--wt-page-wrapper-content-wrapper-color);
}
</style>