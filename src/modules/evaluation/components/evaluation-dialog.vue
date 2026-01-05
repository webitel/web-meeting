<template>
  <call-result-container>
    <template #title>{{ t('evaluation.title') }}</template>

    <template #main>{{ t('evaluation.message') }}</template>

    <template #actions>
      <wt-button color="success" @click="sendEvaluation(EvaluationValues.Good)">
        <wt-icon icon="like" color="on-dark"/>
        {{t('evaluation.good')}}
      </wt-button>

      <wt-button color="error" @click="sendEvaluation(EvaluationValues.Bad)">
        <wt-icon icon="dislike" color="on-dark" />
        {{ t('evaluation.bad')}}
      </wt-button>
    </template>
  </call-result-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import CallResultContainer from '../../evaluation/components/shared/call-result-container.vue';
import { EvaluationAPI } from '../api/evaluation';
import type { AppConfig } from '../../../types/config';
import {
	EvaluationValues,
	type EvaluationValuesType,
} from '../enums/EvaluationValues';
import { useAuthStore } from '../../auth/stores/auth';

const emit = defineEmits<{
	'change-view': [
		view: EvaluationValuesType,
	];
}>();

const { t } = useI18n();
const config = inject<AppConfig>('$config')!;

const authStore = useAuthStore();
const { meetingId } = storeToRefs(authStore);

const sendEvaluation = async (value: EvaluationValuesType) => {
	try {
		await EvaluationAPI.post(
			{
				url: `${config!.evaluation.endpointUrl}/${meetingId.value}/satisfaction`,
			},
			{
				satisfaction: String(config!.evaluation[`${value.toLowerCase()}Grade`]),
			},
		);
		emit('change-view', EvaluationValues.Good);
	} catch (error) {
		console.error('Error sending good evaluation:', error);
		emit('change-view', EvaluationValues.Good);
	}
};
</script>

<style lang="scss" scoped>
.wt-button {
  width: 100%;
}
</style>
