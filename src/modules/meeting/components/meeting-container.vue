<template>
  <div class="meeting-container">
    <video-call
      :sender:stream="localVideoStream"
      :receiver:stream="remoteVideoStream"
      
      :sender:mic:enabled="microphoneEnabled"
      :sender:video:enabled="videoEnabled"
      :sender:mic:accessed="microphoneAccessed"
      :sender:video:accessed="videoAccessed"
      
      :receiver:video:enabled="!!remoteVideoStream"
      :receiver:mic:enabled="!!remoteVideoStream"

      :actions="currentVideoContainerActions"
      
      :key="videoContainerSize"
      :size="videoContainerSize"
      :static="videoContainerStatic"
      hide-header

      :actions:settings:pressed="settingsOpened"
      :actions:chat:pressed="chatOpened"

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
  </div>
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
import { useVideoContainerActionsList } from '../composables/useVideoContainerActionsList';

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

const videoContainerStatic = computed(() => {
	return videoContainerSize.value === ComponentSize.LG;
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

const { actions: currentVideoContainerActions } = useVideoContainerActionsList({
	meetingState,
});

const showContentSlot = computed(() => {
	return !!contentComponent.value;
});

const sidebarStore = useSidebarStore();
const { settingsOpened, chatOpened } = storeToRefs(sidebarStore);
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
  .meeting-container {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .video-call :deep(.video-call-overlay) {
    display: none;
    }
</style>