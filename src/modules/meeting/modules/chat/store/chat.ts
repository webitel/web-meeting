import { ref, watch, inject, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia'
import { useWebsocketController } from '../../../../../app/websocket/composables/useWebsocketController'
import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth';
import { PortalFilesAPI } from '../../chat/api/portalFiles';
import type { AuthData } from '../../../../../types/chat';

// Відкриті питання
// чи треба статус завантаження кожного файлу?
// якщо коннект розірвано - треба якийсь лоадер намалювати?
// формат messages не співпадає з воркспейсом, треба підігнати
// типи для повідомлень - знайти і поміняти нижче

export const useChatStore = defineStore('chat', () => {
  const config = inject<AppConfig>('$config')!;
  // массив повідомлень для відображення в чаті
  const messages = ref([]);                     // дописати тип
  // допоміжна черга повідомлень на відправку якщо підключення розєднано
  const sendQueue = ref([]);                    // дописати тип
  // екземпляр веб сокета
  const controller: WebSocket = ref(null);

  // ініціалізація authStore
  const authStore = useAuthStore();
  const { accessToken, xPortalDevice } = storeToRefs(authStore);
  const authData = computed((): AuthData => {
    return {
      'X-Portal-Access': accessToken.value,
      'X-Portal-Device': xPortalDevice.value,
      'X-Portal-Client': config!.token.appToken,
    }
  });

  const lastMessage = computed(() => messages.value[messages.value.length - 1]);

  // connect
  function connect() {
    controller.value = useWebsocketController({
      url: config.chat.host,                     // wss://dev.webitel.com/portal/ws
      authData: authData.value,
    });

    controller.value?.open();
  }

  watch(accessToken, (token) => {
    if (token && !controller.value) {
      connect();
    }

  }, { immediate: true });

  // safeSendMessage - перевірка чи є підключення
  // якщо ні - пушимо в sendQueue

  function safeSendMessage(payload) {
    if (!controller.value?.isConnected.value) {
      sendQueue.value.push(payload);
      return;
    }
    controller.value.sendMessage(payload);
  }

  // sendSavingMessages - відправка збереженної черги повідомлень після реконекта

  function sendSavingMessages() {
    if (!controller.value?.isConnected?.value) return;

    while (sendQueue.value.length > 0) {
      const msg = sendQueue.value.shift();
      controller.value.sendMessage(msg);
    }
    sendQueue.value = [];
  }

  watch(
    () => controller.value?.isConnected?.value,
    (value) => {
      if (value) {
        sendSavingMessages();
        if (lastMessage.value) reloadHistory();
      }
    }
  );

  // відправка текстового повідомлення

  function sendTextMessage(text: string = '') {
    safeSendMessage({
      path: 'SendMessage',
      data: {
        text,
      }
    })
  }

  // завантаження файлу

  async function uploadFile(file: File, retry = 3): Promise<string> {
    try {
      const { uploadId } = await PortalFilesAPI.post({
        params: {
          mimeType: file.type || 'application/octet-stream',
          name: file.name,
        },
        headers: authData.value,
      });

      const { fileId } = await PortalFilesAPI.put({
        file,
        uploadId: uploadId,
        headers: authData.value,
      });

      return fileId;
    } catch (e) {
      if (retry > 0)
        return uploadFile(file, retry - 1);
      throw e;
    }
  }

  // відправка кожного файлу окремо

  async function sendFiles(files: File[]) {
    const uploadedIds = await Promise.all(
      files.map(file => uploadFile(file))
    );

    safeSendMessage({
      path: 'SendMessage',
      data: {
        file: uploadedIds,
      }
    });
  }

  // дозавантаження історії повідомлень
  // вивантажуємо не всю історію, а нові повідомлення від offset останнього збереженного на нашій стороні

  function reloadHistory() {
    safeSendMessage({
      path: 'ChatUpdates',
      data: {
        offset: lastMessage.value?.id,
      }
    });
  }

  // відключення вебсокета

  function disconnect() {
    controller.value?.closeConnection();
    controller.value = null;
  }

  // обробка вхідних повідомлень

  watch(
    () => controller.value?.messageHandlers.value,
    (newMessages) => {
      if (!newMessages || newMessages.length === 0) return;

      const last = newMessages[newMessages.length - 1];
      if (!last) return;

      const rootType = last.data?.["@type"];

      if (
        rootType === "type.googleapis.com/webitel.portal.Response" &&
        last.data?.data?.["@type"] === "type.googleapis.com/webitel.portal.UpdateNewMessage"
      ) {
        messages.value.push(last.data.data);
      } else if (
        rootType === "type.googleapis.com/webitel.portal.UpdateNewMessage" &&
        last.data?.dispo === "Incoming"
      ) {
        messages.value.push(last.data);
      }

      if (controller.value) {
        controller.value.messageHandlers.value = [];
      }
    },
    { deep: true }
  );


  return {
    messages,

    connect,
    disconnect,
    sendTextMessage,
    sendFiles,
  }
});
