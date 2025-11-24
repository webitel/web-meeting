import { inject } from 'vue'


const websocketController = () => {
  const $config = inject('$config');
  const ws = new WebSocket($config.call.host);

  ws.addEventListener('open', () => {

    ws.send(JSON.stringify({
      type: 'WSState', /// заюзать енуму з віджета?
    }));
  });

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
    } catch (e) {
      throw e;
    }
  });

  ws.addEventListener('error', (err) => {
    console.error('[WS] error:', err);
  });

  ws.addEventListener('close', (event) => {
    console.log('[WS] closed', event.code, event.reason);
  });

  const send = (data: any) => {
    ws.send(JSON.stringify(data));
  };

  const close = () => {
    ws.close(1000, 'client closed connection');
  };

  return {
    ws,
    send,
    close,
  };
};

