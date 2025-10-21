<template>
    <meeting-actions-bar>
        <microphone-toggle-action
         :state="true /* TODO: add state */"
         :allowed="hasMicrophoneAccess"
         />
        <video-toggle-action
         :state="true /* TODO: add state */"
         :allowed="hasCameraAccess"
         />
        <settings-toggle-action
            :state="openedDevicesSettingsPanel" 
            @toggle="toggleDevicesSettingsPanel" 
         />
    </meeting-actions-bar>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';

    import MeetingActionsBar from '../../main-scene/components/shared/meeting-actions-bar.vue';
    import MicrophoneToggleAction from './actions/microphone-toggle-action.vue';
    import VideoToggleAction from './actions/video-toggle-action.vue';
    import SettingsToggleAction from './actions/settings-toggle-action.vue';
    import { useMainSceneStore } from '../../main-scene/stores/mainScene';
    import { useDevicesStore } from '../stores/devices';

    const mainSceneStore = useMainSceneStore();
    const { openedDevicesSettingsPanel } = storeToRefs(mainSceneStore);
    const { toggleDevicesSettingsPanel } = mainSceneStore;

    const devicesStore = useDevicesStore();
    const { hasMicrophoneAccess, hasCameraAccess } = storeToRefs(devicesStore);
</script>

<style scoped></style>