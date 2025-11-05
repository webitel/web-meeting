<template>
    <meeting-actions-bar>
        <microphone-toggle-action
         :state="microphoneState ?? false" 
         @toggle="microphoneState = !microphoneState" 
        />
        <video-toggle-action
         :state="videoState ?? false"
         @toggle="videoState = !videoState" 
        />
        <settings-toggle-action
         :state="openedDevicesSettingsPanel" 
         @toggle="toggleDevicesSettingsPanel"
          />
    </meeting-actions-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import MeetingActionsBar from '../../actions/components/meeting-actions-bar.vue';
import MicrophoneToggleAction from '../../actions/components/actions/microphone-toggle-action.vue';
import VideoToggleAction from '../../actions/components/actions/video-toggle-action.vue';
import SettingsToggleAction from '../../actions/components/actions/settings-toggle-action.vue';
import { useMainSceneStore } from '../../main-scene/stores/mainScene';

const microphoneState = defineModel<boolean>('with-audio');
const videoState = defineModel<boolean>('with-video');

const mainSceneStore = useMainSceneStore();
const { openedDevicesSettingsPanel } = storeToRefs(mainSceneStore);
const { toggleDevicesSettingsPanel } = mainSceneStore;
</script>

<style scoped></style>