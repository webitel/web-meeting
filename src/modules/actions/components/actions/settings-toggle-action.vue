<template>
    <wt-rounded-action
        icon="settings"
       @click="emit('toggle')"
    />
</template>

<script setup lang="ts">
const _props = defineProps<{
	state: boolean;
}>();

const _emit = defineEmits<{
	toggle: [];
}>();
</script>

<style scoped></style>