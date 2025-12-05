import { instance } from '../../../../../app/api/instance';
import { applyTransform, snakeToCamel } from '@webitel/api-services/api/transformers'

// GET /files
// Отримання інформації про завантаження.
// Приймає URL параметр uploadId.
// Можна отримати тільки якщо завантаження було з якихось причин перервано,
// при успішному завантаженні такої інформації не буде.
const getPortalFile = async ({uploadId: string}): Promise => {
  const response = await instance.get('/portal/files', {
    params: { uploadId: string },
    headers: {
      //'X-Portal-Device': 'portal-device-id',
    },
  });
  return applyTransform(response.data, [
    snakeToCamel(),
  ]);
};
// POST /files - Нове завантаження.
// Створює нове завантаження, приймає метадані файлу, віддає айді завантаження.
// Необхідні хедери всі ті самі що я описував для вебсокета нижче.

  const postPortalFile = async({ file, headers }): Promise => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const responce = await instance.post('http://localhost:8080/meet/portal/files', formData,{
    params: {
      mime_type: file.type,
      name: file.name,
    },
    headers: {
      ...headers,
      'content-type': 'multipart/form-data',
    }
  });
  return applyTransform(responce.data, [
    snakeToCamel(),
  ]);
};
  // PUT /files Дозавантаження.
  // Продовження або початок завантаження.
  // Приймає URL параметр uploadId отриманий з апі вище.
  // Body запиту - multipart form-data з файлом.
const putPortalFile = async({ uploadId: string }): Promise => {

  const responce = await instance.put('/portal/files', {
    params: { uploadId: string },
    headers: {
      'Content-Type': 'multipart/form-data',
      //'X-Portal-Device': 'portal-device-id',
    },
  });
  return applyTransform(responce.data, [
    snakeToCamel(),
  ]);
};

export const PortalFilesAPI = {
  get: getPortalFile,
  post: postPortalFile,
  put: putPortalFile,
}
