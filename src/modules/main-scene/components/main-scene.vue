<template>
  <main class="main-scene">
    <wt-notifications-bar />
    <brand-logo />
    <div class="main-scene__contents">
      <component
        :is="mainSceneComponent"
        @hungup="hideMeetingContainer = true"
      />
      <sidebar-panel
      v-if="sidebarPanelOpened"
      />
     </div>
  </main>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { inject, ref, computed } from 'vue';
import type { AppConfig } from '../../../types/config';
import MeetingContainer from '../../meeting/components/meeting-container.vue';
import SidebarPanel from '../../sidebar/components/sidebar-panel.vue';
import { useSidebarStore } from '../../sidebar/store/sidebar';
import BrandLogo from './shared/brand-logo.vue';
import EvaluationWrapper from '../../evaluation/components/evaluation-wrapper.vue';

const $config = inject<AppConfig>('$config')!;
const hideMeetingContainer = ref(false);

const mainBackground = `url(${new URL($config.assets.mainBackground, import.meta.url).href})`;

const sidebarStore = useSidebarStore();
const { opened: sidebarPanelOpened } = storeToRefs(sidebarStore);

const mainSceneComponent = computed(() =>
	hideMeetingContainer.value ? EvaluationWrapper : MeetingContainer,
);
</script>

<style scoped>
.main-scene {
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

.main-scene__contents {
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  gap: var(--spacing-sm);
}

.meeting-component {
  flex: 1 1 auto;
}
</style>
