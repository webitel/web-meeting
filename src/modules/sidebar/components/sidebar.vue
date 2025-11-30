<template>
  <component
    v-if="opened"
    :is="sidebarComponent"
    @close="toggle"/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia'
import DevicesSettingsPanel from '../../devices/components/devices-settings-panel.vue';
import ChatPanel from '../../meeting/components/meeting-actions-bar.vue';
import { useSidebarStore } from '../store/sidebar.ts'

const { toggle } = useSidebarStore();
const { opened, status } = storeToRefs(useSidebarStore);

const sidebarComponent = computed(() => {
  switch (status.value) {
    case 'chat': return ChatPanel;
    default: return DevicesSettingsPanel;
  }
})
</script>
