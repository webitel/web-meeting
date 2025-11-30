import { ref } from 'vue'
import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', () => {
  const opened = ref<boolean>(false);
  const mode: "settings" | "chat" = ref("settings");


  const toggle = (mode: 'settings') => {
    if (mode) mode.value = mode;
    opened.value = !opened.value;
    if (!opened.value) mode.value = 'settings';
  }
  return { opened, mode, toggle }
})
