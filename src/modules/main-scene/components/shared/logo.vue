<template>
  <img :src="$config.style.logoPicture" class="logo"/>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const $config = inject('$config');
</script>

<style scoped>
.logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  height: 86px;
  width: 86px;
}
</style>
