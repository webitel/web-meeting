<template>
    <wt-rounded-action
        icon="settings"
       @click="emit('toggle')"
    />
</template>

<script setup lang="ts">
// import { WtRoundedAction } from '@webitel/ui-sdk/components';

const props = defineProps<{
    state: boolean;
}>();

const emit = defineEmits<{
    'toggle': [];
}>();
</script>

<style scoped></style>