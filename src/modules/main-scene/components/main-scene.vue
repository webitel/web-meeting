<template>
    <main class="main-scene">
        <!-- <router-view /> -->
        <!-- <div>main</div> -->
        <allow-devices-dialog
            @settings:toggle="toggleSettings"
        />
        <devices-config-panel v-if="settings" />
    </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AllowDevicesDialog from '../../service-dialogs/components/allow-devices-dialog.vue';
import DevicesConfigPanel from '../../devices/components/devices-config-panel.vue';

const settings = ref(true);

function toggleSettings() {
    settings.value = !settings.value;
}
</script>

<style scoped>
.main-scene {
    --brand-gradient-45: linear-gradient(45deg, hsla(291, 90%, 60%, 1), hsla(232, 75%, 40%, 1));

    display: flex;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);

    flex-grow: 1;
    max-width: 100%;
    min-height: 100%;
    background: var(--brand-gradient-45);
}

</style>