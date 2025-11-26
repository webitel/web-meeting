import { computed, ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { SceneState } from '../enums/SceneState';
import { useDevicesStore } from '../../devices/stores/devices';
import { useMeetingStore } from '../../meeting/stores/meeting';
// import { PortalAPI } from '../api/portal';
// import useWebsocketController from '../../../app/websocket/useWebsocketController';

export const useMainSceneStore = defineStore('mainScene', () => {
    const openedDevicesSettingsPanel = ref<boolean>(false);
    // const { open } = websocketController();

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

    // @Lera24:
    // https://github.com/webitel/web-meeting/pull/2/files#r2559210128

    // const initialize = async () => {
    //   const url = new URL(window.location.href);
    //   const params = url.searchParams;
    //
    //   // @Lera24:
    //   // прокинути тільки ті параметри що необхідно, а не все
    //   const { token } = await PortalAPI.postPortalToken(...params);
    //   open({ payload: { token }})
    // }

    return {
        sceneState,
        openedDevicesSettingsPanel,

        toggleDevicesSettingsPanel,
    };
});
