import {
	applyTransform,
	camelToSnake,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { instance } from '../../../../../app/api/instance';
import type { AuthData } from '../types/chat';

// @author @Lera24
// https://webitel.atlassian.net/browse/WTEL-7899?focusedCommentId=708994

export type PortalFileMeta = {
	name: string;
	mimeType?: string;
};

export type PortalFileUploadResult = {
	fileId: string;
	size: string;
	mimeType: string;
	name: string;
	hash: string;
};

export type PortalFilePostResult = {
	uploadId: string;
};

// loading file
// https://webitel.atlassian.net/browse/WTEL-7899?focusedCommentId=711601
const getPortalFile = async (params: { url: string; headers: AuthData }) => {
	const { url, headers } = params;

	const { data } = await instance.get(url, {
		headers,
	});
	return data;
};

//New upload. Creates a new upload, takes the file metadata, and returns the upload ID.

const postPortalFile = async (params: {
	url: string;
	file: PortalFileMeta;
	headers: AuthData;
}): Promise<PortalFilePostResult> => {
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
	]) as PortalFilePostResult;
};

// Reupload. Continue or start the upload. Accepts the URL parameter uploadId obtained from the API above.
// Request body - multipart form-data with the file.

const putPortalFile = async (params: {
	url: string;
	file: File;
	uploadId: string;
	headers: AuthData;
}): Promise<PortalFileUploadResult> => {
	const { url, file, uploadId, headers } = params;

	const finalUrl = `${url}?uploadId=${uploadId}`;

	const responce = await instance.put(finalUrl, file, {
		headers,
	});
	return applyTransform(responce.data, [
		snakeToCamel(),
	]) as PortalFileUploadResult;
};

export const PortalFilesAPI = {
	get: getPortalFile,
	post: postPortalFile,
	put: putPortalFile,
};
