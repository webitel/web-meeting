<template>
  <meeting-service-dialog class="call-ended">

    <p class="call-ended__title">
      {{ t('call.ended') }}
    </p>

      <wt-button
        color="success"
        :loading="isStartingCall"
        @click="makeCall"
      >{{t('call.joinAgain')}}
      </wt-button>
  </meeting-service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { useCallStore } from '../../call/store/call';
import MeetingServiceDialog from './shared/meeting-service-dialog.vue';

const { t } = useI18n();

const callStore = useCallStore();
const { isStartingCall } = storeToRefs(callStore);
const { makeCall } = callStore;
</script>


<style scoped lang="scss">
@use '@webitel/styleguide/typography' as *;

.call-ended__title {
  @extend %typo-heading-3;
}
</style>
