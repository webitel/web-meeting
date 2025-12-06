<template>
    <wt-rounded-action
        icon="call-end"
        color="error"
        @click="emit('click')"
    />
</template>

<script setup lang="ts">
const _emit = defineEmits<{
	click: [];
}>();
</script>

<style scoped></style>