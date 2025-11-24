import { computed, ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { SceneState } from '../enums/SceneState';
import { useDevicesStore } from '../../devices/stores/devices';
import { useMeetingStore } from '../../meeting/stores/meeting';
import { PortalAPI } from '../api/portal';
import websocketController from '../../../app/websocket/websocketController';

export const useMainSceneStore = defineStore('mainScene', () => {
    const openedDevicesSettingsPanel = ref<boolean>(false);
    const { open } = websocketController();

    const devicesStore = useDevicesStore();
    const { permissionGranted } = storeToRefs(devicesStore);

    const meetingStore = useMeetingStore();
    const { session } = storeToRefs(meetingStore);

    const shouldShowAllowDevicesDialog = computed(() => {
        return !permissionGranted.value;
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

    const initialize = async () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;

      const { token } = PortalAPI.postPortalToken(...params);
      open({ payload: { token }})
    }

    return {
        sceneState,
        openedDevicesSettingsPanel,

        initialize,
        toggleDevicesSettingsPanel,
    };
});
