import type { Ref } from 'vue';
import type { AuthData } from '@/types/chat.ts';
import type { WebSocketStatus } from '@vueuse/core';
import type {  WebSocketStatus } from '@vueuse/core';
import type { AuthData } from '../../../types/chat';

interface ControllerParams {
  url: string;
  authData: AuthData;
}

interface WSMessage {
  id?: string
  path?: string
  data?: unknown
}

interface SendMessagePayload {
  path: string;
  data: Record<string, unknown>;
}

interface WebSocketController {
  status: WebSocketStatus;
  data: string | null;
  sendMessage: ({path: string, data: SendMessagePayload}) => boolean;
  close: () => void;
  messageHandlers: Ref<WSMessage[]>;
  isConnected: Ref<boolean>;
}
