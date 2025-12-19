import {
	applyTransform,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { instance } from '../../../app/api/instance';

const postEvaluation = async (
	{
		url,
	}: {
		url: string;
	},
	{
		satisfaction,
	}: {
		satisfaction: string;
	},
) => {
	const responce = await instance.post(url, {
		satisfaction,
	});
	return applyTransform(responce.data, [
		snakeToCamel(),
	]);
};

export const EvaluationAPI = {
	post: postEvaluation,
};
