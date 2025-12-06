import { useWebSocket } from '@vueuse/core';
import { nanoid } from 'nanoid';
import { ref } from 'vue';
import type { ControllerParams, WSMessage, SendMessagePayload, WebSocketController } from '../../../types/webSocket';

// в кінці прибрати консоль логи

export const useWebsocketController = ({url, authData}: ControllerParams):WebSocketController => {
  const messageHandlers = ref<WSMessage[]>([]);
  const isConnected = ref(false);

  const {
    send,
    open,
    close } = useWebSocket(url, {
    immediate: false,
    autoReconnect: {
      retries: Infinity,
      delay: 1000,
    },
    heartbeat: {
      message: 'pong',
      responseMessage: 'pong',
      interval: 30000,
      pongTimeout: 5000,
    },
    onConnected() {
      try {
        send(JSON.stringify({
          meta: {
            ...authData,
          },
        }));
        isConnected.value = true;
      } catch (e) {
        console.error('WS send auth error', e);
      }
    },
    onMessage(ws: WebSocket, event: MessageEvent<string>) {
      if (!event.data ||
        event.data === 'undefined' ||
        event.data === 'null') return;

      try {
        const parsed: WSMessage = JSON.parse(event.data);
        messageHandlers.value.push(parsed);

      } catch (e) {
        console.error('WS parse error', e);
      }
    },
    onError(error) {
      console.error('[WS] error:', error);
    },
    onDisconnected(event) {
      isConnected.value = false;
      console.log('[WS] disconnected:', event);

    }
  })

  function sendMessage ({path, data}: SendMessagePayload):boolean {
    const payload = {
      id: nanoid(),
      path: `webitel.portal.ChatMessages/${path}`,
      data: {
        '@type': 'type.googleapis.com/webitel.portal.SendMessageRequest',       // поміняти на тип
        ...data,
      }
  }
    return send(JSON.stringify(payload))
  }

  return {
    messageHandlers,
    isConnected,

    sendMessage,
    open,
    close,
  }
}

