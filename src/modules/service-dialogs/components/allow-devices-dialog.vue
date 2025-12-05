<template>
    <service-dialog>
        <template #title>
            Allow Devices
        </template>
        <template #main>
            <p>Please allow access to your microphone and camera to continue.</p>
            <wt-button :loading="isRequesting" color="error" @click="requestDeviceAccess">
                Request Device Access
            </wt-button>
        </template>
        <template #actions>
        <device-actions-bar />
        </template>
    </service-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDevicesStore } from '../../devices/stores/devices';

const _emit = defineEmits<{
	'settings:toggle': [];
}>();

const devicesStore = useDevicesStore();
const { isRequesting } = storeToRefs(devicesStore);

const { requestDeviceAccess } = devicesStore;
</script>

<style scoped></style>
