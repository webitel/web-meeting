<template>
    <wt-rounded-action :icon="props.state ? 'video-cam' : 'video-cam-off'" :disabled="!allowed" @click="onToggle" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDevicesStore } from '../../../devices/stores/devices';

const _props = defineProps<{
	state: boolean;
}>();

const emit = defineEmits<{
	toggle: [];
}>();

const devicesStore = useDevicesStore();
const { hasAnyCameras: allowed } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

function _onToggle() {
	if (!allowed.value) {
		requestDeviceAccess();
	} else {
		emit('toggle');
	}
}
</script>

<style scoped></style>