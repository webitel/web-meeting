<template>
    <meeting-service-dialog class="join-dialog">
          <p class="join-dialog__title">{{ t('call.joinMessage') }}</p>
         <wt-button
             color="success"
             @click="makeCall"
            >
            {{t('call.join').toUpperCase()}}
        </wt-button>
    </meeting-service-dialog>
</template>

<script setup lang="ts">
import { WtButton } from '@webitel/ui-sdk/components';
import { useI18n } from 'vue-i18n';
import { useCallStore } from '../../call/store/call';
import MeetingServiceDialog from './shared/meeting-service-dialog.vue';

const { t } = useI18n();

const callStore = useCallStore();
const { makeCall } = callStore;
</script>

<style scoped lang="scss">
@use '@webitel/styleguide/typography' as *;

.join-dialog__title {
  @extend %typo-heading-3;
}
</style>
