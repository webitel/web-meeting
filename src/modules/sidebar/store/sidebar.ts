import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { SidebarModeType } from '../enums/SidebarMode';

export const useSidebarStore = defineStore('sidebar', () => {
  const mode = ref<SidebarModeType | null>(null);

  const opened = computed(() => {
    return !!mode.value;
  });

  const changeMode = (newMode: SidebarModeType) => {
    if (mode.value !== newMode) {
      mode.value = newMode;
    } else {
      close();
    }
  };

  function close() {
    mode.value = null;
  }

  return {
    opened,
    mode,
    changeMode,
    close,
  };
});
