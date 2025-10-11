<template>
    <main class="main-scene">
        <!-- <router-view /> -->
        <div>main</div>
        <devices-config-panel />
    </main>
</template>

<script lang="ts" setup>
import DevicesConfigPanel from '../../devices/components/devices-config-panel.vue';
</script>

<style scoped>
.main-scene {
    --devices-config-panel-width: 320px;
    --brand-gradient-45: linear-gradient(45deg, hsla(291, 90%, 60%, 1), hsla(232, 75%, 40%, 1));

    display: grid;
    grid-template-columns: 1fr var(--devices-config-panel-width);

    flex-grow: 1;
    max-width: 100%;
    min-height: 100%;
    background: var(--brand-gradient-45);
}
</style>