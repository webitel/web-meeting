import { ref, watch, inject } from 'vue';
import { defineStore } from 'pinia'
import { useWebsocketController } from '../../../../../app/websocket/composables/useWebsocketController'
import { AppConfig } from '../../../../../types/AppConfig';

export const useChatStore = defineStore('chat', (url: string) => {
  const messages = ref<any[]>([]);
  const newMessage = ref<string | null>(null);
  const config = inject<AppConfig>('$config')!;

  const controller = useWebsocketController({
    url: config.chat.host,
  });

  watch(
    () => controller.data.value,
    (msg) => {
      if (!msg) return;
      newMessage.value = msg;
      messages.value.push(msg);
    },
  );

  function connect() {
    controller.open();
  }

  function disconnect() {
    controller.closeConnection();
  }

  function send(payload: any) {
    controller.sendMessage(payload);
  }


  return {
    connect,
    disconnect,
    send,
  }
});
