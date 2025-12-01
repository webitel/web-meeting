<template>
  <component
    v-if="opened"
    :is="sidebarPanelComponent"
    @close="toggle"/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia'
import DevicesSettingsPanel from '../../devices/components/devices-settings-panel.vue';
import ChatPanel from '../../meeting/components/meeting-actions-bar.vue';
import { useSidebarStore } from '../store/sidebar'

const sidebarPanel = useSidebarStore();
const { toggle } = sidebarPanel;
const { opened, mode } = storeToRefs(sidebarPanel);

const sidebarPanelComponent = computed(() => {
  switch (mode.value) {
    case 'chat': return ChatPanel;
    default: return DevicesSettingsPanel;
  }
})
</script>
