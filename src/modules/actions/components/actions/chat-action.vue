<template>
  <wt-rounded-action
    icon="chat" @click="emit('toggle')" :disables="!props.state"/>
</template>

<script setup lang="ts">
const _props = defineProps<{
	state: boolean;
}>();

const _emit = defineEmits<{
	toggle: [];
}>();
</script>
