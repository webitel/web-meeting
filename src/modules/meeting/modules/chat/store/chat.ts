import { ref, watch, inject } from 'vue';
import { defineStore, storeToRefs } from 'pinia'
import { useWebsocketController } from '../../../../../app/websocket/composables/useWebsocketController'
import type { AppConfig } from '../../../../../types/AppConfig';
import { useAuthStore } from '../../../../auth/stores/auth';
import { nanoid } from 'nanoid'
import { useWebSocket } from '@vueuse/core';
import img from "../../../../../../public/assets/web-logo.svg";
import { PortalFilesAPI } from '../api/portalFiles'

export const useChatStore = defineStore('chat', () => {
  const config = inject<AppConfig>('$config');
  const authStore = useAuthStore();
  const { accessToken } = storeToRefs(authStore);

  const headers = {
    "X-Portal-Access": accessToken.value,
    "X-Portal-Client": config.token.appToken,
    "X-Portal-Device": config.temp.deviceId,
  }

  const socket = new WebSocket('wss://dev.webitel.com/portal/ws');

  async function connect() {
    socket.addEventListener('open', () => {
      console.log('Connected');

      socket.send(JSON.stringify({
        meta: headers,
      }));

      console.log('sent meta headers!');
    });
  }

  async function fileFromUrl(url: string, filename?: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();

    const name = filename || url.split('/').pop() || 'file';

    return new File([blob], name, { type: blob.type });
  }

  async function sendMessage(payload) {
    let data;

    const defaultPayload = {
      id: nanoid(),
      path: 'webitel.portal.ChatMessages/SendMessage', //webitel.portal.ChatMessages/
      data: {
        '@type': 'type.googleapis.com/webitel.portal.SendMessageRequest',
      }
    }

    if (typeof payload === 'string') {
      data = {
        ...defaultPayload,
        data: {
          ...defaultPayload.data,
          text: payload,
        }
      }
    }
    if (typeof payload === 'object') { //перевырка на файл
      const file = await fileFromUrl(img); //поміняти на пейлоад
      const { upload_id } = await PortalFilesAPI.post({ file, headers })


      data = {
        ...defaultPayload,
        data: {
          ...defaultPayload.data,
          file: upload_id,
        }
      }
    }
    socket.send(JSON.stringify({...data}));
  }

  socket.addEventListener("message", (event) => {
    console.log("Message:", event.data);
  });

  socket.addEventListener("error", (err) => {
    console.log("Error:", err);
  });

  socket.addEventListener("close", () => {
    console.log("Closed");
  });



  return {
    connect,
    sendMessage,
  }
});
