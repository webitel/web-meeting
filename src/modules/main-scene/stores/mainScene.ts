import { computed, ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { SceneState } from '../enums/SceneState';
import { useDevicesStore } from '../../devices/stores/devices';
import { useMeetingStore } from '../../meeting/stores/meeting';

export const useMainSceneStore = defineStore('mainScene', () => {
    const openedDevicesSettingsPanel = ref<boolean>(false);

    const devicesStore = useDevicesStore();
    const { hasMicrophoneAccess, hasCameraAccess } = storeToRefs(devicesStore);
    
    const meetingStore = useMeetingStore();
    const { session } = storeToRefs(meetingStore);

    const shouldShowAllowDevicesDialog = computed(() => {
        return !hasMicrophoneAccess.value || !hasCameraAccess.value;
    });

    const sceneState = computed<SceneState>(() => {
        if (session.value) {
            return SceneState.ActiveMeeting;
        }
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