<template>
  <service-dialog
    class="meeting-container"
    size="lg"
   >
    
    <template #main>
    <meeting-call />
    </template>
    
  </service-dialog>
</template>

<script setup lang="ts">import MeetingCall from '../modules/call/components/meeting-call.vue';
import ServiceDialog from '../../service-dialogs/components/shared/service-dialog.vue';
</script>

<style scoped></style>
