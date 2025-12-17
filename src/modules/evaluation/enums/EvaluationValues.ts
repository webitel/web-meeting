export const EvaluationValues = {
	Good: 'Good',
	Bad: 'Bad',
} as const;

export type EvaluationValuesType =
	(typeof EvaluationValues)[keyof typeof EvaluationValues];
