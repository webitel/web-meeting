<template>
    <main class="main-scene">
        <component :is="sceneComponent" />
        <devices-config-panel v-if="openedDevicesSettingsPanel" />
    </main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import MeetingContainer from '../../meeting/components/meeting-container.vue';
import AllowDevicesDialog from '../../service-dialogs/components/allow-devices-dialog.vue';
import JoinDialog from '../../service-dialogs/components/join-dialog.vue';
import DevicesConfigPanel from '../../devices/components/devices-settings-panel.vue';
import { useMainSceneStore } from '../stores/mainScene';
import { SceneState } from '../enums/SceneState';

const mainSceneStore = useMainSceneStore();
const {
    sceneState,
    openedDevicesSettingsPanel,
 } = storeToRefs(mainSceneStore);

const sceneComponent = computed(() => {
    switch (sceneState.value) {
        case SceneState.AllowDevicesDialog:
            return AllowDevicesDialog;
        case SceneState.JoinDialog:
            return JoinDialog;
        case SceneState.ActiveMeeting:
            return MeetingContainer;
        default:
            return null;
    }
});

// initialize();

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
