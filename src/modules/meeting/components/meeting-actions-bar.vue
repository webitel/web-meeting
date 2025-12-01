<template>
  <meeting-actions-bar>
    <microphone-toggle-action :state="sessionMute" @toggle="toggleMute" />
    <video-toggle-action :state="videoEnabled" @toggle="toggleVideo" />
    <settings-toggle-action :state="isSettingsOpened" @toggle="toggleSettingsPanel" />
    <handup-action @click="hangup" />
    <chat-action :state="isChatOpened" @toggle="toggleChatPanel" />
  </meeting-actions-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useMeetingStore } from '../stores/meeting';
import MeetingActionsBar from '../../actions/components/meeting-actions-bar.vue';
import HandupAction from '../../actions/components/actions/handup-action.vue';
import MicrophoneToggleAction from '../../actions/components/actions/microphone-toggle-action.vue';
import VideoToggleAction from '../../actions/components/actions/video-toggle-action.vue';
import SettingsToggleAction from '../../actions/components/actions/settings-toggle-action.vue';
import ChatAction from '../../actions/components/actions/chat-action.vue';
import { useSidebarStore } from '../../sidebar/store/sidebar';
import { SidebarMode } from '../../sidebar/enums/SidebarMode';

const meeting = useMeetingStore();
const { sessionMute, videoEnabled } = storeToRefs(meeting);
const { toggleMute, toggleVideo, hangup } = meeting;

const sidebarStore = useSidebarStore();
const { opened: sidebarPanelOpened, mode: sidebarPanelMode } = storeToRefs(sidebarStore);
const { toggle: toggleSidebarPanel, changeMode: changeSidebarMode } = sidebarStore;

const isSettingsOpened = computed(() => {
    return sidebarPanelMode.value === SidebarMode.Settings && sidebarPanelOpened.value;
});

const isChatOpened = computed(() => {
  return sidebarPanelMode.value === SidebarMode.Chat && sidebarPanelOpened.value;
});

const toggleSettingsPanel = () => {
  if(isSettingsOpened.value) {
    toggleSidebarPanel()
  } else {
    changeSidebarMode(SidebarMode.Settings);
    toggleSidebarPanel();
  }
}

const toggleChatPanel = () => {
  if(isChatOpened.value) {
    toggleSidebarPanel()
  } else {
    changeSidebarMode(SidebarMode.Chat);
    toggleSidebarPanel();
  }
}
</script>

<style scoped></style>
