<template>
  <main class="the-main-scene">
    <wt-notifications-bar />
    <brand-logo />
    <div class="the-main-scene__contents">
      <component :is="mainSceneComponent" />
      <orientation-overlay v-if="showOrientationOverlay" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, inject } from 'vue';
import type { AppConfig } from '../../appConfig/types/AppConfig';
import { useAuthStore } from '../../auth/stores/auth';
import { useIsLandscape } from '../composables/useIsLandscape';
import InvalidLinkErrorBlock from '../modules/error-blocks/components/invalid-link-error-block.vue';
import OpenInBrowserErrorBlock from '../modules/error-blocks/components/open-in-browser-error-block.vue';
import { isInAppWebView } from '../scripts/isInAppWebView';
import { isMobile } from '../scripts/isMobile';
import OrientationOverlay from './orientation-overlay.vue';
import BrandLogo from './shared/brand-logo.vue';
import TheMeetingScene from './the-meeting-scene.vue';

const $config = inject<AppConfig>('$config') as AppConfig;

const mainBackground = `url(${new URL($config.assets.mainBackground, import.meta.url).href})`;

const { isLandscape } = useIsLandscape();

const authStore = useAuthStore();
const { isInvalidLink, accessToken, isAuthorizingInProgress } =
	storeToRefs(authStore);

const isAuthorized = computed(() => !!accessToken.value);

const mainSceneComponent = computed(() => {
	if (isInAppWebView()) {
		return OpenInBrowserErrorBlock;
	}

	if (isInvalidLink.value) {
		return InvalidLinkErrorBlock;
	}

	if (isAuthorizingInProgress.value) {
		return null; // todo: add loading component
	}

	if (!isAuthorized.value) {
		return null;
	}

	return TheMeetingScene;
});

const showOrientationOverlay = computed(() => isMobile() && isLandscape.value);
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
