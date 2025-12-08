<template>
  <main-scene>
    <router-view />
  </main-scene>
</template>

<script lang="ts" setup>
import { useAuthStore } from './modules/auth/stores/auth';
import MainScene from './modules/main-scene/components/main-scene.vue';

const authStore = useAuthStore();

authStore.initialize();
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
