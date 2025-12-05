import { useWebSocket } from '@vueuse/core';

// @Lera24
// delete at the end if not using

export const useWebsocketController = ({url, authData}) => {
  const { status, data, send, open, close } = useWebSocket(url, {
    immediate: false,
    onConnected(ws) {
      // reserved for future
      send(JSON.stringify({ 
meta: {
  ...authData,
},
      }))
    },
    onMessage(event) {
      try {
        const data = JSON.parse(event.data);
      } catch (e) {
        throw e;
      }
    },
    onError(error) {
      console.error('[WS] error:', error);
    },
    onDisconnected(event) {
      console.log('[WS] disconnected:', event);
    }
  });

  function sendMessage (text: string) {

    const payload = { id: Math.random().toString(36).substring(2, 15),
    path: 'webitel.portal.ChatMessages/SendMessage', //webitel.portal.ChatMessages/
    data: {
      '@type': 'type.googleapis.com/webitel.portal.SendMessageRequest',
      text,
    }
  }

    return send(JSON.stringify(payload))
  }

  function closeConnection () {
    return close(1000, 'client closed connection')
  }

  return {
    status,
    data,
    sendMessage,
    open,
    closeConnection,
  }
}

