import { ref } from 'vue'
import { defineStore } from 'pinia';
import { SidebarMode } from '../enums/SidebarMode';
import type { SidebarModeType } from '../enums/SidebarMode';

export const useSidebarStore = defineStore('sidebar', () => {
  const opened = ref<boolean>(false);
  const mode = ref<SidebarModeType>(SidebarMode.Settings);

  const changeMode = (mode: SidebarModeType) => {
    if(mode.value !== mode) mode.value = mode;
  }

  const toggle = () => {
    opened.value = !opened.value;
  }
  return { opened, mode, toggle, changeMode }
})
