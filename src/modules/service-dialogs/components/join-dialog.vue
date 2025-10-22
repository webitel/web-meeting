<template>
    <service-dialog>
        <template #title>
            Join Meeting
        </template>
        <template #main>
            <wt-button
             color="success" 
             @click="makeCall(number)"
             >Join Meeting
            </wt-button>
        </template>
        <template #actions>
            <device-actions-bar />
        </template>
    </service-dialog>
</template>

<script setup lang="ts">
import ServiceDialog from '../../main-scene/components/shared/service-dialog.vue';
import DeviceActionsBar from '../../devices/components/device-actions-bar.vue';
import { useMeetingStore } from '../../meeting/stores/meeting';

const meetingStore = useMeetingStore();
const { makeCall } = meetingStore;

const number = import.meta.env.DEV ? '00' : '';
</script>

<style scoped></style>