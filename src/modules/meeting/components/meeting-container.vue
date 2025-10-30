<template>
    <service-dialog class="meeting-container">
        <meeting-call />
        <meeting-actions-bar />
    </service-dialog>
</template>

<script setup lang="ts">
import MeetingCall from '../modules/call/components/meeting-call.vue';
import MeetingActionsBar from './meeting-actions-bar.vue';
</script>

<style scoped></style>