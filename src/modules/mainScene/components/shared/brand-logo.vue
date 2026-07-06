<template>
  <img
   class="brand-logo"
   :src="$config.assets.logoPicture" 
   />
</template>

<script setup lang="ts">
import { inject } from 'vue';

import type { AppConfig } from '../../../appConfig/types/AppConfig';

const $config = inject<AppConfig>('$config') as AppConfig;
</script>

<style scoped>
.brand-logo {
  height: 86px;
  width: 86px;
}
</style>
