<template>
  <sidebar-content-wrapper class="meeting-chat" @close="emit('close')">
    <template #title>
      <wt-icon icon="chat--filled" color="info"></wt-icon>
      <p>{{ t('chat') }}</p>
    </template>

    <template #main>
      <chat-container-component
        :messages="uiMessages"
        :chat-actions="[
          ChatAction.SendMessage, 
          ChatAction.AttachFiles, 
          ChatAction.EmojiPicker,
          ]"
        @[`action:${ChatAction.SendMessage}`]="localSendMessage"
        @[`action:${ChatAction.AttachFiles}`]="localSendFile"
      />
    </template>
  </sidebar-content-wrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { ChatAction, ChatContainerComponent, type ChatMessageType as UiChatMessageType } from '@webitel/ui-chats/ui';
import type { Message as PortalChatMessageType } from '@buf/webitel_chat.community_timostamm-protobuf-ts/messages/message_pb';
import type { ResultCallbacks } from '@webitel/ui-sdk/src/types';

import { useChatStore } from '../store/chat';
import SidebarContentWrapper from '../../../../sidebar/components/shared/sidebar-content-wrapper.vue';

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n();

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);
const { connect, sendMessage, sendFile } = chatStore;

// connect();

const uiMessages = computed<UiChatMessageType[]>(() => {

  const portalMessages: PortalChatMessageType[] = messages?.value ?? [];

  const uiMsgs: UiChatMessageType[] = portalMessages.map((msg) => msg);

  return uiMsgs;
});

async function localSendMessage(text: string, options?: ResultCallbacks) {
  await sendMessage(text);
  options?.onSuccess?.();
} 

async function localSendFile(files: File[], options?: ResultCallbacks) {
  await sendFile(files);
  options?.onSuccess?.();
}
</script>
