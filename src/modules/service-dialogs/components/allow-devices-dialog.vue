<template>
    <service-dialog>
        <h1>Allow Devices</h1>
        <div>
            <h2>Microphone</h2>
            <p>{{ hasMicrophoneAccess }}</p>
        </div>
        <div>
            <h2>Camera</h2>
            <p>{{ hasCameraAccess }}</p>
        </div>
        <wt-button :loading="isRequesting" color="success" @click="requestDeviceAccess">
            Request Device Access
        </wt-button>
        <wt-button @click="emit('settings:toggle')">
            Toggle Settings
        </wt-button>
    </service-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import ServiceDialog from '../../main-scene/components/shared/service-dialog.vue';
import { useDevicesStore } from '../../devices/stores/devices';

const emit = defineEmits<{
    'settings:toggle': [];
}>();

const devicesStore = useDevicesStore();
const {
    isRequesting,
    hasMicrophoneAccess,
    hasCameraAccess,
} = storeToRefs(devicesStore);

const {
    requestDeviceAccess,
} = devicesStore;


</script>

<style scoped></style>