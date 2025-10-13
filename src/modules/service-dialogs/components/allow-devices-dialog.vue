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
        <wt-button @click="emit('settings:toggle')">
            Toggle Settings
        </wt-button>
    </service-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import ServiceDialog from './shared/service-dialog.vue';
import { useDevicesStore } from '../../devices/stores/devices';

const emit = defineEmits<{
    'settings:toggle': [];
}>();

const devicesStore = useDevicesStore();
const { hasMicrophoneAccess, hasCameraAccess } = storeToRefs(devicesStore);


</script>

<style scoped>

</style>