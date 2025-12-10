<template>
    <video-call
      :sender:stream="localVideoStream"
      :receiver:stream="remoteVideoStream"
      
      :sender:mic:enabled="microphoneEnabled"
      :sender:video:enabled="videoEnabled"
      :sender:mic:accessed="microphoneAccessed"
      :sender:video:accessed="videoAccessed"
      
      :receiver:video:enabled="!!remoteVideoStream"
      :receiver:mic:enabled="!!remoteVideoStream"

      :actions="[
        VideoCallAction.Mic, 
        VideoCallAction.Video, 
        VideoCallAction.Settings, 
        VideoCallAction.Chat, 
        VideoCallAction.Hangup,
      ]"
      
      :size="videoContainerSize"
      hide-header
      static


      @[`action:${VideoCallAction.Mic}`]="toggleMute"
      @[`action:${VideoCallAction.Video}`]="toggleVideo"
      @[`action:${VideoCallAction.Settings}`]="toggleSettingsPanel"
      @[`action:${VideoCallAction.Chat}`]="toggleChatPanel"
      @[`action:${VideoCallAction.Hangup}`]="hangup"
    >
      <template 
        #content
        v-if="showContentSlot"
      >
      <!-- <video-container /> -->
        <component
          :is="contentComponent"
        />
      </template>
    </video-call>
</template>

<script setup lang="ts">
import {
	VideoCall,
	VideoCallAction,
} from '@webitel/ui-sdk/modules/CallSession';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { ComponentSize } from '@webitel/ui-sdk/enums';

import { useDevicesStore } from '../../devices/stores/devices';
import { SidebarMode } from '../../sidebar/enums/SidebarMode';
import { useSidebarStore } from '../../sidebar/store/sidebar';
import { useMeetingStore } from '../stores/meeting';
import { useMainSceneStore } from '../../main-scene/stores/mainScene';
import { MeetingState } from '../../main-scene/enums/MeetingState';
import AllowDevicesDialog from '../modules/service-dialogs/components/allow-devices-dialog.vue';
import JoinDialog from '../modules/service-dialogs/components/join-dialog.vue';
import VideoContainer from '../modules/call/components/video/video-container.vue';

const meetingStore = useMeetingStore();

const { remoteVideoStream, localVideoStream, microphoneEnabled, videoEnabled } =
	storeToRefs(meetingStore);

const { toggleMute, toggleVideo, hangup } = meetingStore;

const mainSceneStore = useMainSceneStore();
const { meetingState } = storeToRefs(mainSceneStore);

const videoContainerSize = computed(() => {
	if (meetingState.value === MeetingState.ActiveMeeting) {
		return ComponentSize.LG;
	}
	return ComponentSize.MD;
});

const contentComponent = computed(() => {
	switch (meetingState.value) {
		case MeetingState.AllowDevicesDialog:
			return AllowDevicesDialog;
		case MeetingState.JoinDialog:
			return JoinDialog;
		default:
			return null;
	}
});

const showContentSlot = computed(() => {
	return !!contentComponent.value;
});

const sidebarStore = useSidebarStore();
const { mode: sidebarPanelMode } = storeToRefs(sidebarStore);
const { changeMode: changeSidebarMode } = sidebarStore;

const toggleSettingsPanel = () => {
	changeSidebarMode(SidebarMode.Settings);
};

const toggleChatPanel = () => {
	changeSidebarMode(SidebarMode.Chat);
};

const devicesStore = useDevicesStore();
const { hasAnyMicrophones: microphoneAccessed, hasAnyCameras: videoAccessed } =
	storeToRefs(devicesStore);
</script>

<style scoped>
  .video-call :deep(.video-call-overlay) {
    display: none;
      z-index: -1 !important;
    }
</style>