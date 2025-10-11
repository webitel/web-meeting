<template>
  <main-scene>
    <router-view />
  </main-scene>
</template>

<script lang="ts" setup>
import MainScene from './modules/main-scene/components/main-scene.vue';
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
