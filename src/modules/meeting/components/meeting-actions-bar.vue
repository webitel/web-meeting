<template>
    <meeting-actions-bar>
        <microphone-toggle-action :state="sessionMute" @toggle="toggleMute" />
        <video-toggle-action :state="videoEnabled" @toggle="toggleVideo" />
        <settings-toggle-action :state="isSettingOpened" @toggle="toggleSidebar" />
        <handup-action  @click="hangup" />
        <chat-action :state="isChatOpened" @toggle="toggleSidebar('chat')" />
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

const meeting = useMeetingStore();
const { sessionMute, videoEnabled } = storeToRefs(meeting);
const { toggleMute, toggleVideo, hangup } = meeting;

const { toggle: toggleSidebar } = useSidebarStore();
const { opened: openedSidebar, mode: modeSidebar } = storeToRefs(useSidebarStore);

const isSettingOpened = computed(() => {
    return openedSidebar.value && modeSidebar.value === 'settings';
});

const isChatOpened = computed(() => {
  return openedSidebar.value && modeSidebar.value === 'chat';
})
</script>

<style scoped></style>
