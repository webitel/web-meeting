<template>
    <meeting-service-dialog>
          <p>{{ t('call.allowMessage' )}}</p>

        <wt-button
            :loading="isRequesting"
            color="error"
            @click="allowAccess"
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
import { DeviceErrors } from '../../../../devices/enums/DeviceErrors';
import { inject } from 'vue';

const { t } = useI18n();
const eventBus = inject('$eventBus');

const devicesStore = useDevicesStore();
const { isRequesting, error } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

const allowAccess = async () => {
	await requestDeviceAccess();
	if (error.value === DeviceErrors.Denied) {
		eventBus.$emit('notification', {
			type: 'error',
			text: t('call.accessDeniedMessage'),
		});
	}
};
</script>

<style scoped></style>
