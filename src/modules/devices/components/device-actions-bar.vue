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
        :state="sidebarPanelOpened"
        @toggle="changeSidebarPanelMode(SidebarMode.Settings)"
      />

    </meeting-actions-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MicrophoneToggleAction from '../../actions/components/actions/microphone-toggle-action.vue';
import SettingsToggleAction from '../../actions/components/actions/settings-toggle-action.vue';
import VideoToggleAction from '../../actions/components/actions/video-toggle-action.vue';
import MeetingActionsBar from '../../actions/components/meeting-actions-bar.vue';
import { useSidebarStore } from '../../sidebar/store/sidebar';
import { SidebarMode } from '../../sidebar/enums/SidebarMode';

const microphoneState = defineModel<boolean>('with-audio');
const videoState = defineModel<boolean>('with-video');

const sidebarStore = useSidebarStore();
const { opened: sidebarPanelOpened } = storeToRefs(sidebarStore);
const { changeMode: changeSidebarPanelMode } = useSidebarStore();
</script>

<style scoped></style>
