<template>
 <wt-popup
   :size="ComponentSize.XS"
   :closable="false"
   class="evaluation-popup"
 >
   <template #title>{{ t('webMeeting.evaluation.title') }}</template>
   <template #main>
     <div class="evaluation-popup__message">
       <p>{{ t('webMeeting.evaluation.message') }}</p>
     </div>

     <wt-textarea :placeholder="t('objects.chat.draftPlaceholder')"></wt-textarea>
   </template>

   <template #actions>
     <div class="evaluation-popup__actions">
       <wt-button color="success">
         <wt-icon icon="like" color="on-dark"/>
         {{t('webMeeting.evaluation.good')}}
       </wt-button>
       <wt-button color="error">
         <wt-icon icon="dislike" color="on-dark" />
         {{ t('webMeeting.evaluation.bad')}}
       </wt-button>
     </div>
   </template>
 </wt-popup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ComponentSize } from '@webitel/ui-sdk/enums'

const { t } = useI18n();
</script>
<style scoped>
.evaluation-popup__message {
  padding: var(--spacing-sm);
  text-align: center;
}

.evaluation-popup__actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;

  button {
    flex: 1;
  }
}
</style>
