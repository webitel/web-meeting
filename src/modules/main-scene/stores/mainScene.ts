import { computed, ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { SceneState } from '../enums/SceneState';
import { useDevicesStore } from '../../devices/stores/devices';

export const useMainSceneStore = defineStore('mainScene', () => {
    const openedDevicesSettingsPanel = ref<boolean>(false);

    const devicesStore = useDevicesStore();
    const { hasMicrophoneAccess, hasCameraAccess } = storeToRefs(devicesStore);


    const shouldShowAllowDevicesDialog = computed(() => {
        return hasMicrophoneAccess.value && hasCameraAccess.value;
    });

    const sceneState = computed<SceneState>(() => {
        if (shouldShowAllowDevicesDialog.value) {
            return SceneState.AllowDevicesDialog;
        }
        return SceneState.JoinDialog;
    });

    function toggleDevicesSettingsPanel() {
        openedDevicesSettingsPanel.value = !openedDevicesSettingsPanel.value;
    }

    
    return {
        sceneState,
        openedDevicesSettingsPanel,
    
        toggleDevicesSettingsPanel,
    };
});