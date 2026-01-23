<template>
  <meeting-service-dialog class="allow-devices-dialog">
    <p class="allow-devices-dialog__title typo-heading-3">{{ t('devices.allowMessage') }}</p>

    <wt-button
      :loading="isRequesting"
      color="error"
      @click="allowAccess"
    >
      {{ t('devices.allow') }}
    </wt-button>
  </meeting-service-dialog>
</template>

<script
  setup
  lang="ts"
>
import { WtButton } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import MeetingServiceDialog from './shared/meeting-service-dialog.vue';

import { useDevicesPermissionsStore } from '../../../../devices/modules/permissions/stores/permissions';
import { DeviceErrors } from '../../../../devices/enums/DeviceErrors';
import { inject } from 'vue';

const { t } = useI18n();
const eventBus = inject('$eventBus');

const devicesStore = useDevicesPermissionsStore();
const { isRequesting, error } = storeToRefs(devicesStore);
const { requestDeviceAccess } = devicesStore;

const allowAccess = async () => {
	await requestDeviceAccess();
	if (error.value === DeviceErrors.Denied) {
		// @ts-expect-error todo: add eventBus types
		eventBus.$emit('notification', {
			type: 'error',
			text: t('devices.accessDeniedNotificationText'),
		});
	}
};
</script>

<style
  scoped
  lang="scss"
>
.allow-devices-dialog__title {
  text-align: center;
  padding: 0 var(--spacing-md);
}
</style>
