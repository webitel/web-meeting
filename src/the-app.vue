<template>
  <main-scene>
    <router-view />
  </main-scene>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { inject, nextTick, onMounted } from 'vue';
import { useAuthStore } from './modules/auth/stores/auth';
import MainScene from './modules/main-scene/components/main-scene.vue';
import type { AppConfig } from './types/config';
import packageJson from '../package.json' with { type: 'json' };

const authStore = useAuthStore();
const config = inject<AppConfig>('$config')!;

const { locale } = useI18n();

// To check current build version
const build = import.meta.env.VITE_BUILD_NUMBER;
window.buildVersion = `v${packageJson.version}-${build}`;

onMounted(async () => {
	await nextTick();
	await authStore.initialize();
	locale.value = config.lang || 'en';
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
