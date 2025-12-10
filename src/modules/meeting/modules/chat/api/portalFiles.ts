import {
	applyTransform,
	camelToSnake,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { instance } from '../../../../../app/api/instance';

// @author @Lera24
// https://webitel.atlassian.net/browse/WTEL-7899?focusedCommentId=708994

//New upload. Creates a new upload, takes the file metadata, and returns the upload ID.

const postPortalFile = async ({ params, headers }) => {
	const values = applyTransform(
		{
			mimeType: params.mimeType || 'application/octet-stream',
			...params,
		},
		[
			camelToSnake(),
		],
	);

	const responce = await instance.post('/portal/files', values, {
		headers,
	});
	return applyTransform(responce.data, [
		snakeToCamel(),
	]);
};

// Reupload. Continue or start the upload. Accepts the URL parameter uploadId obtained from the API above.
// Request body - multipart form-data with the file.

const putPortalFile = async ({ file, uploadId, headers }): Promise => {
	const uploadIdValue = applyTransform(uploadId, [
		camelToSnake(),
	]);

	const responce = await instance.put('/portal/files', {
		file,
		params: {
			uploadId: uploadIdValue,
		},
		headers,
	});
	return applyTransform(responce.data, [
		snakeToCamel(),
	]);
};

export const PortalFilesAPI = {
	post: postPortalFile,
	put: putPortalFile,
};
