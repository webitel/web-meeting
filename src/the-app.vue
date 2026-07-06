<template>
  <main-scene>
    <!-- <router-view /> useless for now --> 
  </main-scene>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import packageJson from '../package.json' with { type: 'json' };
import type { AppConfig } from './modules/appConfig/types/AppConfig';
import { useAuthStore } from './modules/auth/stores/auth';
import MainScene from './modules/mainScene/components/the-main-scene.vue';
import { isUnsupportedUserAgent } from './modules/mainScene/modules/error-blocks/scripts/isUnsupportedUserAgent';

const authStore = useAuthStore();
const config = inject<AppConfig>('$config') as AppConfig;

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
