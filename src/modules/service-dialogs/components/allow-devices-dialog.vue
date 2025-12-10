<template>
    <service-dialog>
        <template #title>
            Allow Devices
        </template>
        <template #main>
            <p>{{t('call.allowMessage')}}</p>
            <wt-button :loading="isRequesting" color="error" @click="requestDeviceAccess">
                {{ t('call.allow').toUpperCase() }}
            </wt-button>
        </template>
        <template #actions>
        <device-actions-bar />
        </template>
    </service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import DeviceActionsBar from '../../devices/components/device-actions-bar.vue';
import { useDevicesStore } from '../../devices/stores/devices';
import ServiceDialog from './shared/service-dialog.vue';

const emit = defineEmits<{
	'settings:toggle': [];
}>();

const { t } = useI18n();

const devicesStore = useDevicesStore();
const { isRequesting } = storeToRefs(devicesStore);

const { requestDeviceAccess } = devicesStore;
</script>

<style scoped></style>
