<template>
    <meeting-actions-bar>
        <microphone-toggle-action :state="sessionMute" @toggle="toggleMute" />
        <video-toggle-action :state="videoEnabled" @toggle="toggleVideo" />
        <settings-toggle-action :state="openedDevicesSettingsPanel" @toggle="toggleDevicesSettingsPanel" />
        <handup-action @click="hangup" />
    </meeting-actions-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useMeetingStore } from '../stores/meeting';
import { useMainSceneStore } from '../../main-scene/stores/mainScene';
import MeetingActionsBar from '../../actions/components/meeting-actions-bar.vue';
import HandupAction from '../../actions/components/actions/handup-action.vue';
import MicrophoneToggleAction from '../../actions/components/actions/microphone-toggle-action.vue';
import VideoToggleAction from '../../actions/components/actions/video-toggle-action.vue';
import SettingsToggleAction from '../../actions/components/actions/settings-toggle-action.vue';


const meeting = useMeetingStore();
const { sessionMute, videoEnabled } = storeToRefs(meeting);
const { toggleMute, toggleVideo, hangup } = meeting;

const mainSceneStore = useMainSceneStore();
const { openedDevicesSettingsPanel } = storeToRefs(mainSceneStore);
const { toggleDevicesSettingsPanel } = mainSceneStore;
</script>

<style scoped></style>
