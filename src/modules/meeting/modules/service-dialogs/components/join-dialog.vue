<template>
    <meeting-service-dialog>
          <p>{{ t('call.ended') }}</p>
         <wt-button
             color="success"
             @click="makeCall({ withAudio, withVideo })"
            >
            {{t('call.join').toUpperCase()}}
        </wt-button>
    </meeting-service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeetingStore } from '../../../stores/meeting';
import MeetingServiceDialog from './shared/meeting-service-dialog.vue';

const { t } = useI18n();

const withAudio = ref<boolean>(true);
const withVideo = ref<boolean>(true);

const meetingStore = useMeetingStore();
const { makeCall } = meetingStore;
</script>

<style scoped></style>
