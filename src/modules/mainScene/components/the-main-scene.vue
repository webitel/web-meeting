<template>
  <main class="the-main-scene">
    <wt-notifications-bar />
    <brand-logo />
    <div class="the-main-scene__contents">
      <component
        :is="mainSceneComponent"
        @chat-opened="openChatConnection"
      />
      <sidebar-panel
      v-if="sidebarPanelOpened"
      />
      <orientation-overlay v-if="showOrientationOverlay" />
     </div>
  </main>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, inject, watch } from 'vue';
import type { AppConfig } from '../../appConfig/types/AppConfig';
import { useAuthStore } from '../../auth/stores/auth';
import EvaluationWrapper from '../../evaluation/components/evaluation-wrapper.vue';
import MeetingContainer from '../../meeting/components/the-meeting-container.vue';
import {
	SessionState,
	useCallStore,
} from '../../meeting/modules/call/store/call';
import { useChatStore } from '../../meeting/modules/chat/store/chat';
import SidebarPanel from '../../sidebar/components/sidebar-panel.vue';
import { useSidebarStore } from '../../sidebar/store/sidebar';
import { useIsLandscape } from '../composables/useIsLandscape';
import InvalidLinkErrorBlock from '../modules/error-blocks/components/invalid-link-error-block.vue';
import OpenInBrowserErrorBlock from '../modules/error-blocks/components/open-in-browser-error-block.vue';
import { isInAppWebView } from '../scripts/isInAppWebView';
import { isMobile } from '../scripts/isMobile';
import OrientationOverlay from './orientation-overlay.vue';
import BrandLogo from './shared/brand-logo.vue';

const $config = inject<AppConfig>('$config') as AppConfig;

const mainBackground = `url(${new URL($config.assets.mainBackground, import.meta.url).href})`;

const { isLandscape } = useIsLandscape();

const authStore = useAuthStore();
const { isInvalidLink, isAuthorizingInProgress } = storeToRefs(authStore);

const sidebarStore = useSidebarStore();
const { opened: sidebarPanelOpened } = storeToRefs(sidebarStore);

const callStore = useCallStore();
const { sessionState, isSessionStateFinished } = storeToRefs(callStore);

const chatStore = useChatStore();
const { isConnected: isChatConnected } = storeToRefs(chatStore);
const { connect: chatConnect } = chatStore;

const closeSidebarPanel = () => {
	if (sidebarPanelOpened) sidebarStore.close();
};

const mainSceneComponent = computed(() => {
	if (isInAppWebView()) {
		return OpenInBrowserErrorBlock;
	}

	if (isAuthorizingInProgress.value) {
		return null; // todo: add loading component
	}

	if (isInvalidLink.value) {
		return InvalidLinkErrorBlock;
	}

	return sessionState.value === SessionState.COMPLETED
		? EvaluationWrapper
		: MeetingContainer;
});

const showOrientationOverlay = computed(() => isMobile() && isLandscape.value);

const openChatConnection = () => {
	if (!isChatConnected.value) {
		chatConnect();
	}
};

watch(isSessionStateFinished, (value) => {
	if (value) closeSidebarPanel();
});
</script>

<style scoped>
.the-main-scene {
  position: relative;
  width: 100%;
  height: 100%;
  padding: var(--spacing-sm);
  background-size: cover;
  background-position: center;
  background-image: v-bind(mainBackground);
}

.brand-logo {
  z-index: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.the-main-scene__contents {
  z-index: 1;
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  gap: var(--spacing-sm);
}

.meeting-component {
  flex: 1 1 auto;
}
</style>
