<template>
  <img
   class="brand-logo"
   :src="$config.assets.logoPicture" 
   />
</template>

<script setup lang="ts">
import { inject } from 'vue';

import type { AppConfig } from '../../../../types/config';

const $config = inject<AppConfig>('$config')!;
</script>

<style scoped>
.brand-logo {
  height: 86px;
  width: 86px;
}
</style>
