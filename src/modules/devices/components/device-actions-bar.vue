<template>
    <meeting-actions-bar>
        <microphone-toggle-action
         :state="microphoneState ?? false"
         @toggle="microphoneState = !microphoneState"
        />
        <video-toggle-action
         :state="videoState ?? false"
         @toggle="videoState = !videoState"
        />
        <settings-toggle-action
         :state="sidebarPanelOpened"
         @toggle="toggleSidebarPanel"
        />

    </meeting-actions-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSidebarStore } from '../../sidebar/store/sidebar';

const _microphoneState = defineModel<boolean>('with-audio');
const _videoState = defineModel<boolean>('with-video');

const { opened: sidebarPanelOpened } = storeToRefs(useSidebarStore);
const { toggle: toggleSidebarPanel } = useSidebarStore();
</script>

<style scoped></style>
