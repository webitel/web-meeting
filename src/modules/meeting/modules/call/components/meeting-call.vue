<template>
    <video-call
      :sender:stream="localVideoStream"
      :receiver:stream="remoteVideoStream"

      :sender:mic:enabled="microphoneEnabled"
      :sender:video:enabled="videoEnabled"
      
      :actions="[
        VideoCallAction.Mic, 
        VideoCallAction.Video, 
        VideoCallAction.Settings, 
        VideoCallAction.Chat, 
        VideoCallAction.Hangup,
      ]"
      
      position="static"
      @[`action:${VideoCallAction.Mic}`]="toggleMute"
      @[`action:${VideoCallAction.Video}`]="toggleVideo"
      @[`action:${VideoCallAction.Settings}`]="toggleSettingsPanel"
      @[`action:${VideoCallAction.Chat}`]="toggleChatPanel"
      @[`action:${VideoCallAction.Hangup}`]="hangup"
    />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { VideoCall, VideoCallAction } from '@webitel/ui-sdk/modules/CallSession';

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