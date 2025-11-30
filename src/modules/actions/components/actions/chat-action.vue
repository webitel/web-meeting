<template>
  <wt-rounded-action
    icon="chat" @click="emit('toggle')" :disables="!props.state"/>
</template>

<script setup lang="ts">
import { WtRoundedAction } from '@webitel/ui-sdk/components';

const props = defineProps<{
  state: boolean;
}>();

const emit = defineEmits<{
  'toggle': []
}

</script>
