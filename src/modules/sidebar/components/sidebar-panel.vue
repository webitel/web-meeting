<template>
  <section class="sidebar-panel">
    <component
    v-if="sidebarPanelComponent"
    :is="sidebarPanelComponent"
    @close="close"/>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia'
import DevicesSettingsPanel from '../../devices/components/devices-settings-panel.vue';
import {WtButton as ChatPanel} from '@webitel/ui-sdk/components';
import { useSidebarStore } from '../store/sidebar'
import { SidebarMode } from '../../sidebar/enums/SidebarMode'

const sidebarPanel = useSidebarStore();
const { close } = sidebarPanel;
const { mode } = storeToRefs(sidebarPanel);

const sidebarPanelComponent = computed(() => {
  switch (mode.value) {
    case SidebarMode.Chat: return ChatPanel;
    case SidebarMode.Settings: return DevicesSettingsPanel;
    default: return null;
  }
})
</script>

<style scoped>
.sidebar-panel {
  width: 320px;
  height: 100%;
  background: var(--wt-page-wrapper-content-wrapper-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm);
}
</style>
