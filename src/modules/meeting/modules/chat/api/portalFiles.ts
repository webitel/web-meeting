import {
	applyTransform,
	camelToSnake,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { instance } from '../../../../../app/api/instance';

// @author @Lera24
// https://webitel.atlassian.net/browse/WTEL-7899?focusedCommentId=708994

// loading file
// https://webitel.atlassian.net/browse/WTEL-7899?focusedCommentId=711601
const getPortalFile = async (params) => {
	const { url, headers } = params;

	const { data } = await instance.get(url, {
		headers,
	});
	return data;
};

//New upload. Creates a new upload, takes the file metadata, and returns the upload ID.

const postPortalFile = async (params) => {
	const { url, file, headers } = params;

	const finalParams = applyTransform(
		{
			mimeType: file.mimeType || 'application/octet-stream',
			...file,
		},
		[
			camelToSnake(),
		],
	);

	const responce = await instance.post(url, finalParams, {
		headers,
	});
	return applyTransform(responce.data, [
		snakeToCamel(),
	]);
};

// Reupload. Continue or start the upload. Accepts the URL parameter uploadId obtained from the API above.
// Request body - multipart form-data with the file.

const putPortalFile = async (params): Promise => {
	const { url, file, uploadId, headers } = params;

	const finalUrl = `${url}?uploadId=${uploadId}`;

	const formData = new FormData();
	formData.append('file', file);

	const responce = await instance.put(finalUrl, formData, {
		headers,
	});
	return applyTransform(responce.data, [
		snakeToCamel(),
	]);
};

export const PortalFilesAPI = {
	get: getPortalFile,
	post: postPortalFile,
	put: putPortalFile,
};
