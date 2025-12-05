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
import { useMeetingStore } from '../../meeting/stores/meeting';

const _number = import.meta.env.DEV ? '00' : '';

const _withAudio = ref<boolean>(false);
const _withVideo = ref<boolean>(true);

const meetingStore = useMeetingStore();
const { makeCall } = meetingStore;
</script>

<style scoped></style>
