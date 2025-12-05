import { ref, watch, inject } from 'vue';
import { defineStore, storeToRefs } from 'pinia'
import { useWebsocketController } from '../../../../../app/websocket/composables/useWebsocketController'
import type { AppConfig } from '../../../../../types/config';
import { useAuthStore } from '../../../../auth/stores/auth'

export const useChatStore = defineStore('chat', (url: string) => {
  const messages = ref<any[]>([]);
  const newMessage = ref<string | null>(null);
  const config = inject<AppConfig>('$config');
  const authStore = useAuthStore();
  const { accessToken, xPortalDevice } = storeToRefs(authStore);

  const controller = ref(null);

  // watch(
  //   () => controller.data.value,
  //   (msg) => {
  //     if (!msg) return;
  //     newMessage.value = msg;
  //     messages.value.push(msg);
  //   },
  // );

  watch(accessToken, () => {
    connect();
  });

  function connect() {
    controller.value = useWebsocketController({
      url: 'wss://dev.webitel.com/portal/ws', // config.chat.host,
      authData: {
        'X-Portal-Access': accessToken.value,
        'X-Portal-Device': xPortalDevice.value,
        'X-Portal-Client': config!.token.appToken,
      },
    });

    // if (controller.ws?.readyState === WebSocket.OPEN
    //   || controller.ws?.readyState === WebSocket.CONNECTING) {
    //   return;
    // }
    controller.value?.open();
  }

  function disconnect() {
    controller.value?.closeConnection();
  }

  function sendMessage(text: string) {
    controller.value?.sendMessage(text);
  }


  return {
    controller,
    connect,
    disconnect,
    sendMessage,
  }
});
