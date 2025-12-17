<template>
  <sidebar-content-wrapper
    class="meeting-chat"
    @close="emit('close')">
    <template #title>
      <wt-icon icon="chat--filled" color="info"></wt-icon>
      <p>{{ t('chat.chat') }}</p>
    </template>

    <template #main>
      <chat-container
        :messages="uiMessages"
        :chat-actions="[
          ChatAction.SendMessage,
          ChatAction.AttachFiles,
          ChatAction.EmojiPicker,
          ]"
        @load="loadFile"
        @[`action:${ChatAction.SendMessage}`]="localSendMessage"
        @[`action:${ChatAction.AttachFiles}`]="localSendFile"
      />
    </template>
  </sidebar-content-wrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import {
	ChatAction,
	ChatContainer,
	type ChatMessageType as UiChatMessageType,
} from '@webitel/ui-chats/ui';
import type { Message as PortalChatMessageType } from '@buf/webitel_chat.community_timostamm-protobuf-ts/messages/message_pb';
import type { ResultCallbacks } from '@webitel/ui-sdk/src/types';

import { useChatStore } from '../store/chat';
import SidebarContentWrapper from '../../../../sidebar/components/shared/sidebar-content-wrapper.vue';

const emit = defineEmits<{
	close: [];
}>();

const { t } = useI18n();

const chatStore = useChatStore();
const { messages, isConnected } = storeToRefs(chatStore);
const { sendTextMessage, sendFiles, connect, loadFile } = chatStore;

const uiMessages = computed<UiChatMessageType[]>(() => {
	const portalMessages: PortalChatMessageType[] = messages?.value ?? [];
	const uiMsgs: UiChatMessageType[] = portalMessages.map((msg) => {
		const { id, date: createdAt, from, file, text } = msg.message;

		const message = {
			id,
			createdAt,
			member: {
				id: from.id,
				name: from.name,
				type: from.type,
				self: from.name === 'You' ? true : false,
			},
		};
		if (file)
			message.file = {
				id: file.id,
				name: file.name,
				size: file.size,
				mime: file.type,
				url: file.url,
			};
		if (text) message.text = text;
		return message;
	});

	return uiMsgs;
});

async function localSendMessage(text: string, options?: ResultCallbacks) {
	await sendTextMessage(text);
	options?.onSuccess?.();
}

async function localSendFile(files: File[], options?: ResultCallbacks) {
	await sendFiles(files);
	options?.onSuccess?.();
}

onMounted(() => {
	if (!isConnected.value) {
		connect();
	}
});
</script>
