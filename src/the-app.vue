<template>
  <main-scene>
    <!-- <router-view /> useless for now --> 
  </main-scene>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from './modules/auth/stores/auth';
import MainScene from './modules/mainScene/components/the-main-scene.vue';
import type { AppConfig } from './types/config';
import { isUnsupportedUserAgent } from './modules/mainScene/modules/error-blocks/scripts/isUnsupportedUserAgent';

import packageJson from '../package.json' with { type: 'json' };

const authStore = useAuthStore();
const config = inject<AppConfig>('$config')!;

const { locale } = useI18n();
locale.value = config.lang;

const router = useRouter();

// To check current build version
const build = import.meta.env.VITE_BUILD_NUMBER;
window.buildVersion = `v${packageJson.version}-${build}`;

onMounted(async () => {
	if (isUnsupportedUserAgent()) {
		return;
	}

	await router.isReady();

	await authStore.initialize();
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
