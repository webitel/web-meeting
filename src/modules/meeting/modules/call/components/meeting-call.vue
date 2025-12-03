<template>
    <video-call
        :sender="localVideoStream"
        :receiver="remoteVideoStream"
        :is-mic-muted="microphoneEnabled"
        :is-video-muted="videoEnabled"
        static-position
        :mic:enabled="true"
        :video:enabled="true"
        :mic-callback="toggleMute"
        :video-callback="toggleVideo"
        :settings-callback="toggleSettingsPanel"
        :chat-callback="toggleChatPanel"
        :hang-over-callback="hangup"
        @smth="() => {}"
        />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { VideoCall } from '@webitel/ui-sdk/modules/CallSession';

import { useSidebarStore } from '../../../../sidebar/store/sidebar';
import { useMeetingStore } from '../../../stores/meeting';
import { SidebarMode } from '../../../../sidebar/enums/SidebarMode';
import VideoContainer from './video/video-container.vue';

const meetingStore = useMeetingStore();

const { 
    remoteVideoStream, 
    localVideoStream, 
    microphoneEnabled, 
    videoEnabled,
 } = storeToRefs(meetingStore);

const { 
    toggleMute, 
    toggleVideo, 
    hangup,
    } = meetingStore;

const sidebarStore = useSidebarStore();
const {
  mode: sidebarPanelMode,
 } = storeToRefs(sidebarStore);
const { changeMode: changeSidebarMode } = sidebarStore;

const toggleSettingsPanel = () => {
  changeSidebarMode(SidebarMode.Settings);
}

const toggleChatPanel = () => {
  changeSidebarMode(SidebarMode.Chat);
}

</script>

<style scoped></style>