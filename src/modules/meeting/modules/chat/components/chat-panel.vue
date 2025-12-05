<template>
  <sidebar-content-wrapper class="chat-panel" @close="emit('close')">
    <template #title>
      <wt-icon icon="chat--filled" color="info"></wt-icon>
      <p>{{ t('chat') }}</p>
    </template>

    <template #main>
      <div class="chat-panel__content">
        <!-- Chat content goes here -->
        <ul>
          <li v-for="message in messages" :key="message.id">{{ message.text }}</li>
        </ul>
      </div>
    </template>
  </sidebar-content-wrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../chat/store/chat';
import SidebarContentWrapper from '../../../../sidebar/components/shared/sidebar-content-wrapper.vue'

const chatStore = useChatStore()
const { connect, sendMessage } = chatStore;
// const { messages } = storeToRefs(chatStore)

const { t } = useI18n()
const text = ref('')

const emit = defineEmits<{
  close: []
}>()

connect();
setTimeout(() => sendMessage('mama'), 3000)

// onMounted( () => {
//   ///await test();
//   connect();
//   sendHeaders();
//   ///sendMessage();
//   setTimeout(() => sendMessage('mama'), 3000)
// })
</script>
