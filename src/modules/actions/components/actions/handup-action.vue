<template>
    <wt-rounded-action
        icon="call-end"
        color="error"
        @click="emit('click')"
    />
</template>

<script setup lang="ts">
import { WtRoundedAction } from '@webitel/ui-sdk/components';

const emit = defineEmits<{
	click: [];
}>();
</script>

<style scoped></style>