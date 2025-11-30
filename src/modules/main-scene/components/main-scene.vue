<template>
  <main class="main-scene">
    <logo />
    <component :is="sceneComponent" />
    <sidebar v-if="openedSidebarPanel"/>
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
import Logo from './shared/logo.vue'
import Sidebar from '../../sidebar/components/sidebar.vue'
import { useSidebarStore } from '../../sidebar/store/sidebar'

const $config = inject('$config');
const mainBackground = `url(${new URL($config.assets.mainBackground, import.meta.url).href})`;

const mainSceneStore = useMainSceneStore()
const { sceneState } = storeToRefs(mainSceneStore);
const { opened: openedSidebarPanel } = storeToRefs(useSidebarStore);

const sceneComponent = computed(() => {
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
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background-size: cover;
  background-position: center;
  background-image: v-bind(mainBackground);
  z-index: 0;
  display: flex;
}
</style>
