<template>
  <main-scene>
    <router-view />
  </main-scene>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { inject, onMounted } from 'vue';
import { useAuthStore } from './modules/auth/stores/auth';
import MainScene from './modules/main-scene/components/main-scene.vue';
import type { AppConfig } from './types/config';

const authStore = useAuthStore();
const config = inject<AppConfig>('$config')!;

const { locale } = useI18n();

onMounted(async () => {
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
