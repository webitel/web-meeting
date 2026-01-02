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
      hide-header
      static

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

import { useDevicesPermissionsStore } from '../../devices/modules/permissions/stores/permissions';
import { SidebarMode } from '../../sidebar/enums/SidebarMode';
import { useSidebarStore } from '../../sidebar/store/sidebar';
import { useCallStore } from '../modules/call/store/call';
import { useMainSceneStore } from '../../main-scene/stores/mainScene';
import { MeetingState } from '../../main-scene/enums/MeetingState';
import AllowDevicesDialog from '../modules/service-dialogs/components/allow-devices-dialog.vue';
import JoinDialog from '../modules/service-dialogs/components/join-dialog.vue';
import CallEndedDialog from '../modules/service-dialogs/components/call-ended.vue';
import { useVideoContainerActionsList } from '../composables/useVideoContainerActionsList';

const callStore = useCallStore();

const { remoteVideoStream, localVideoStream, microphoneEnabled, videoEnabled } =
	storeToRefs(callStore);

const { toggleMute, toggleVideo, hangup } = callStore;

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
		case MeetingState.CallEndedDialog:
			return CallEndedDialog;
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

const devicesStore = useDevicesPermissionsStore();
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
</style>
