import { applyTransform, camelToSnake, snakeToCamel } from '@webitel/api-services/api/transformers'
import { instance } from '../../../../../app/api/instance';

const postPortalFile = async({ params, headers })=> {
  const values = applyTransform(params, [
    camelToSnake(),
  ])

  const responce = await instance.post(
    '/portal/files',
    { ...values },
    { headers },
  )
  return applyTransform(responce.data, [
    snakeToCamel(),
  ]);
};

const putPortalFile = async({ file, uploadId, headers }): Promise => {
  const uploadIdValue = applyTransform(uploadId, [
    camelToSnake(),
  ])

  const responce = await instance.put(
    '/portal/files', {
      file,
      params: { uploadId: uploadIdValue },
      headers
  });
  return applyTransform(responce.data, [
    snakeToCamel(),
  ]);
};

export const PortalFilesAPI = {
  post: postPortalFile,
  put: putPortalFile,
}
