<template>
    <service-dialog>
        <template #title>
            Join Meeting
        </template>
        <template #main>
            <wt-button
             color="success" 
             @click="makeCall(number, { withAudio, withVideo })"
             >Join Meeting
            </wt-button>
        </template>
        <template #actions>
            <device-actions-bar
                v-model:with-audio="withAudio"
                v-model:with-video="withVideo"
            />
        </template>
    </service-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WtButton } from '@webitel/ui-sdk/components';

import ServiceDialog from '../../main-scene/components/shared/service-dialog.vue';
import DeviceActionsBar from '../../devices/components/device-actions-bar.vue';
import { useMeetingStore } from '../../meeting/stores/meeting';

const number = import.meta.env.DEV ? '00' : '';

const withAudio = ref<boolean>(true);
const withVideo = ref<boolean>(true);


const meetingStore = useMeetingStore();
const { makeCall } = meetingStore;

</script>

<style scoped></style>