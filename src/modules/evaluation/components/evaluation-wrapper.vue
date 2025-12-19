<template>
  <component
    :is="evaluationWrapperComponent"
    @change-view="view = $event"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import EvaluationDialog from './evaluation-dialog.vue';
import EvaluationSuccessMessage from './evaluation-success-message.vue';
import EvaluationFailedMessage from './evaluation-failed-message.vue';
import { EvaluationValues } from '../enums/EvaluationValues';

const view = ref('');

const evaluationWrapperComponent = computed(() => {
	switch (view.value) {
		case EvaluationValues.Good:
			return EvaluationSuccessMessage;
		case EvaluationValues.Bad:
			return EvaluationFailedMessage;
		default:
			return EvaluationDialog;
	}
});
</script>
