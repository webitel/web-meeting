<template>
  <service-dialog class="meeting-container">
    <meeting-call />
    <meeting-actions-bar />

    <sidebar v-if="openedSidebar"/>
  </service-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MeetingCall from '../modules/call/components/meeting-call.vue';
import MeetingActionsBar from './meeting-actions-bar.vue';
import ServiceDialog from '../../service-dialogs/components/shared/service-dialog.vue'

import Sidebar from '../../sidebar/components/sidebar.vue'
import { useSidebarStore } from '../../sidebar/store/sidebar'

const { opened: openedSidebar } = storeToRefs(useSidebarStore);
</script>

<style scoped></style>
