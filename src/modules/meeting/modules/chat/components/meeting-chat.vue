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
        without-avatars
        @load="loadFile"
        @[`action:${ChatAction.SendMessage}`]="localSendMessage"
        @[`action:${ChatAction.AttachFiles}`]="localSendFile"
      />
    </template>
  </sidebar-content-wrapper>
</template>

<script setup lang="ts">
import type { UpdateNewMessage } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/messages_pb';
import {
	ChatAction,
	ChatContainer,
	type ChatMessageType as UiChatMessageType,
} from '@webitel/ui-chats/ui';
import type { ResultCallbacks } from '@webitel/ui-sdk/src/types';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SidebarContentWrapper from '../../../../sidebar/components/shared/sidebar-content-wrapper.vue';
import { useChatStore } from '../store/chat';

const emit = defineEmits<{
	close: [];
}>();

const { t } = useI18n();

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);
const { sendTextMessage, sendFiles, loadFile, buildFileUrl } = chatStore;

const uiMessages = computed<UiChatMessageType[]>(() => {
	const portalUpdates: UpdateNewMessage[] = messages.value ?? [];
	return portalUpdates.flatMap((update) => {
		const msg = update.message;
		if (!msg?.from) return [];

		const uiMessage: UiChatMessageType = {
			id: Number(msg.id),
			createdAt: Number(msg.date) || 0,
			member: {
				id: Number(msg.from.id),
				name: msg.from.name,
				type: msg.from.type,
				self: msg.from.name === 'You',
			},
		};

		if (msg.file) {
			uiMessage.file = {
				id: msg.file.id,
				name: msg.file.name,
				size: msg.file.size,
				mime: msg.file.type,
				url: buildFileUrl(msg.file.url),
			};
		}
		if (msg.text) uiMessage.text = msg.text;
		return [
			uiMessage,
		];
	});
});

async function localSendMessage(text: string, options?: ResultCallbacks) {
	await sendTextMessage(text);
	options?.onSuccess?.();
}

async function localSendFile(files: File[], options?: ResultCallbacks) {
	await sendFiles(files);
	options?.onSuccess?.();
}
</script>
