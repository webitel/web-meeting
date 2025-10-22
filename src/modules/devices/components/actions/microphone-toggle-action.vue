<template>
    <wt-rounded-action
        :icon="props.state ? 'mic' : 'mic-muted'"
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