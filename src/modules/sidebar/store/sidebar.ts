import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SidebarMode, type SidebarModeType } from '../enums/SidebarMode';

export const useSidebarStore = defineStore('sidebar', () => {
	const mode = ref<SidebarModeType | null>(null);

	const opened = computed(() => {
		return !!mode.value;
	});

	const settingsOpened = computed(() => {
		return mode.value === SidebarMode.Settings;
	});

	const chatOpened = computed(() => {
		return mode.value === SidebarMode.Chat;
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
		mode,

		opened,
		settingsOpened,
		chatOpened,

		changeMode,
		close,
	};
});
