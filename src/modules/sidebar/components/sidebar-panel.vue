<template>
  <section
    class="sidebar-panel"
    :class="{ 'sidebar-panel--overlay': !isActiveMeeting }"
  >
    <component
    v-if="sidebarPanelComponent"
    :is="sidebarPanelComponent"
    @close="close"/>
  </section>
</template>

<script setup lang="ts">
import MeetingChat from '../../meeting/modules/chat/components/meeting-chat.vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import DevicesSettingsPanel from '../../devices/components/devices-settings-panel.vue';
import { SidebarMode } from '../../sidebar/enums/SidebarMode';
import { useSidebarStore } from '../store/sidebar';
import { useMainSceneStore } from '../../mainScene/stores/mainScene';

const sidebarPanel = useSidebarStore();
const { close } = sidebarPanel;
const { mode } = storeToRefs(sidebarPanel);

const mainSceneStore = useMainSceneStore();
const { isActiveMeeting } = storeToRefs(mainSceneStore);

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
  z-index: 1;
}

.sidebar-panel--overlay {
  position: absolute;
  right: 0;
}
</style>
