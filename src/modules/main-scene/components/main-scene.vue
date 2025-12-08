<template>
  <main class="main-scene">
    <brand-logo />
    <component
     :is="sceneComponent"
     class="scene-component"
     />
    <sidebar-panel
     v-if="sidebarPanelOpened"
     />
  </main>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { storeToRefs } from 'pinia'

import MeetingContainer from '../../meeting/components/meeting-container.vue'
import AllowDevicesDialog from '../../service-dialogs/components/allow-devices-dialog.vue'
import JoinDialog from '../../service-dialogs/components/join-dialog.vue'
import { useMainSceneStore } from '../stores/mainScene'
import { SceneState } from '../enums/SceneState'
import BrandLogo from './shared/brand-logo.vue'
import SidebarPanel from '../../sidebar/components/sidebar-panel.vue'
import { useSidebarStore } from '../../sidebar/store/sidebar';
import type { AppConfig } from '../../../types/config';

const $config = inject<AppConfig>('$config')!;

const mainBackground = `url(${new URL($config.assets.mainBackground, import.meta.url).href})`;

const mainSceneStore = useMainSceneStore()
const { sceneState } = storeToRefs(mainSceneStore);

const sidebarStore = useSidebarStore();
const { opened: sidebarPanelOpened } = storeToRefs(sidebarStore);

const sceneComponent = computed(() => {
  // return MeetingContainer

  switch (sceneState.value) {
    case SceneState.AllowDevicesDialog:
      return AllowDevicesDialog
    case SceneState.JoinDialog:
      return JoinDialog
    case SceneState.ActiveMeeting:
      return MeetingContainer
    default:
      return null
  }
})
</script>

<style scoped>
.main-scene {
  display: flex;
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

.scene-component {
  z-index: 1;
  margin: auto;
}
</style>
