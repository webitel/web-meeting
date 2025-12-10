<template>
    <service-dialog>
        <template #title>
          <p>{{ t('call.allowMessage' )}}</p>
        </template>
        <template #main>
            <wt-button
              :loading="isRequesting"
              color="error"
              @click="allowAccess">
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
import { inject } from 'vue';
import DeviceActionsBar from '../../devices/components/device-actions-bar.vue';
import { useDevicesStore } from '../../devices/stores/devices';
import ServiceDialog from './shared/service-dialog.vue';
import { AccessErrors } from '../../devices/enums/AccessErrors';

const { t } = useI18n();
const eventBus = inject('$eventBus');

const devicesStore = useDevicesStore();
const { isRequesting, error } = storeToRefs(devicesStore);

const { requestDeviceAccess } = devicesStore;

const allowAccess = async () => {
	await requestDeviceAccess();
	if (error.value === AccessErrors.DevicesIsDenied) {
		eventBus.$emit('notification', {
			type: 'error',
			text: t('call.accessDeniedMessage'),
		});
	}
};
</script>

<style scoped></style>
