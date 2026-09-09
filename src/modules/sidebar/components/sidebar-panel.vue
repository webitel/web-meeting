<template>
  <section
    class="sidebar-panel"
    :class="{
      'sidebar-panel--overlay': !isActiveMeeting && !isMobileDevice,
      'sidebar-panel--mobile': isMobileDevice,
    }"
    :style="isMobileDevice ? { '--sheet-height': `${sheetHeight}px` } : undefined"
  >
    <component
    v-if="sidebarPanelComponent"
    :is="sidebarPanelComponent"
    @close="close"/>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import DevicesSettingsPanel from '../../devices/components/devices-settings-panel.vue';
import { isMobile } from '../../mainScene/scripts/isMobile';
import { useMainSceneStore } from '../../mainScene/stores/mainScene';
import MeetingChat from '../../meeting/modules/chat/components/meeting-chat.vue';
import { SidebarMode } from '../../sidebar/enums/SidebarMode';
import { useSheetHeight } from '../composables/useSheetHeight';
import { useSidebarStore } from '../store/sidebar';

const sidebarPanel = useSidebarStore();
const { close } = sidebarPanel;
const { mode } = storeToRefs(sidebarPanel);

const mainSceneStore = useMainSceneStore();
const { isActiveMeeting } = storeToRefs(mainSceneStore);

const { sheetHeight } = useSheetHeight();

const isMobileDevice = isMobile();

const sidebarPanelComponent = computed(() => {
	switch (mode.value) {
		case SidebarMode.Chat:
			return MeetingChat;
		case SidebarMode.Settings:
			return DevicesSettingsPanel;
		default:
			return null;
	}
});
</script>

<style scoped>
.sidebar-panel {
  width: 320px;
  height: 100%;
  background: var(--wt-page-wrapper-content-wrapper-color);
  border-radius: var(--p-border-radius-xl);
  padding: var(--spacing-sm);
  z-index: 10;
}

.sidebar-panel--overlay {
  position: absolute;
  right: 0;
}

.sidebar-panel--mobile {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--sheet-height, 95dvh);
  border-radius: var(--p-border-radius-xl) var(--p-border-radius-xl) 0 0;
  padding-bottom: max(var(--spacing-sm), env(safe-area-inset-bottom));
}
</style>
