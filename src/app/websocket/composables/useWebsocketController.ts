import { useWebSocket } from '@vueuse/core';

// @Lera24
// delete at the end if not using

export const useWebsocketController = ({ url }) => {
  const socket = new WebSocket("wss://dev.webitel.com/portal/ws");

  socket.addEventListener("open", () => {
    console.log("Connected");

    socket.send(JSON.stringify({
      meta: {
        "X-Portal-Access": accessToken.value,
        "X-Portal-Client": config.token.appToken,
        "X-Portal-Device": config.temp.deviceId,
      }
    }));
  });

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
    status,
    data,
    sendMessage: (payload) => send(JSON.stringify(payload)),
    open,
    closeConnection: close,
    ws, // ВАЖНО: возвращаем ws !!!
  }
}

