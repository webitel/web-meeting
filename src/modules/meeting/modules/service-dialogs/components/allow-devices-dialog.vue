<template>
    <meeting-service-dialog>
          <p>{{ t('call.allowMessage' )}}</p>

        <wt-button 
            :loading="isRequesting" 
            color="error" 
            @click="requestDeviceAccess"
        >
             {{ t('call.allow').toUpperCase() }}
        </wt-button>
    </meeting-service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { useDevicesStore } from '../../../../devices/stores/devices';
import MeetingServiceDialog from './shared/meeting-service-dialog.vue';

const { t } = useI18n();

const devicesStore = useDevicesStore();
const { isRequesting } = storeToRefs(devicesStore);

const { requestDeviceAccess } = devicesStore;
</script>

<style scoped></style>
