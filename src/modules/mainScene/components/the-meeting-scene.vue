<template>
  <component
    :is="meetingComponent"
    @chat-opened="openChatConnection"
  />
  <sidebar-panel
    v-if="sidebarPanelOpened"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import EvaluationWrapper from '../../evaluation/components/evaluation-wrapper.vue';
import MeetingContainer from '../../meeting/components/the-meeting-container.vue';
import {
	SessionState,
	useCallStore,
} from '../../meeting/modules/call/store/call';
import { useChatStore } from '../../meeting/modules/chat/store/chat';
import SidebarPanel from '../../sidebar/components/sidebar-panel.vue';
import { useSidebarStore } from '../../sidebar/store/sidebar';

const callStore = useCallStore();
const { sessionState, isSessionStateFinished } = storeToRefs(callStore);

const sidebarStore = useSidebarStore();
const { opened: sidebarPanelOpened } = storeToRefs(sidebarStore);

const chatStore = useChatStore();
const { isConnected: isChatConnected } = storeToRefs(chatStore);
const { connect: chatConnect } = chatStore;

const closeSidebarPanel = () => {
	if (sidebarPanelOpened) sidebarStore.close();
};

const meetingComponent = computed(() => {
	return sessionState.value === SessionState.COMPLETED
		? EvaluationWrapper
		: MeetingContainer;
});

const openChatConnection = () => {
	if (!isChatConnected.value) {
		chatConnect();
	}
};

watch(isSessionStateFinished, (value) => {
	if (value) closeSidebarPanel();
});
</script>
