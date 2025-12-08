<template>
    <wt-rounded-action :icon="props.state ? 'mic' : 'mic-muted'" :disabled="!allowed" @click="onToggle" />
</template>

<script setup lang="ts">
import { WtRoundedAction } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';

import { useDevicesStore } from '../../../devices/stores/devices';

const props = defineProps<{
	state: boolean;
}>();

const emit = defineEmits<{
	toggle: [];
}>();

const devicesStore = useDevicesStore();
const { hasAnyMicrophones: allowed } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

function onToggle() {
	if (!allowed.value) {
		requestDeviceAccess();
	} else {
		emit('toggle');
	}
}
</script>

<style scoped></style>