import { useWebSocket } from '@vueuse/core';


export const websocketController = ({url}) => {
  const { status, data, send, open, close } = useWebSocket(url, {
    immediate: true,
    onConnected(ws) {
      send(JSON.stringify({ type: 'WSState' }))
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

  const sendMessage = (payload: any) => {
    send(JSON.stringify(payload))
  }

  const closeConnection = () => close(1000, 'client closed connection')

  return {
    status,
    data,
    sendMessage,
    open,
    closeConnection,
  }
}

