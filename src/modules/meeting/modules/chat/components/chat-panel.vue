<template>
  <sidebar-wrapper
    class="chat-panel"
    @close="emit('close')"
  >
    <template #title>
      <wt-icon icon="chat--filled" color="info"></wt-icon>
      <p>{{ t('chat')}}</p>
    </template>

    <template #main>
      <div class="chat-panel__content">
        <!-- Chat content goes here -->
        <ul>
          <li
            v-for="message in messages"
            :key="message.id">{{ message.text }}</li>
        </ul>
      </div>
    </template>
  </sidebar-wrapper>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../chat/store/chat';
import SidebarWrapper from '../../../../sidebar/components/sidebar-wrapper.vue'

const { connect, send } = useChatStore();
const { messages } = storeToRefs(useChatStore);

const { t } = useI18n();

const emit = defineEmits<{
  'close': [];
}>();

onMounted(() => {
  connect();
})

</script>
