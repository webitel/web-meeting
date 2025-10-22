<template>
    <wt-rounded-action
        :icon="props.state ? 'video-cam' : 'video-cam-off'"
        :disabled="!props.allowed"
        @click="emit('toggle')"
    />
</template>

<script setup lang="ts">
// import { WtRoundedAction } from '@webitel/ui-sdk/components';

const props = defineProps<{
    state: boolean;
    allowed: boolean;
}>();

const emit = defineEmits<{
    'toggle': [];
}>();
</script>

<style scoped></style>