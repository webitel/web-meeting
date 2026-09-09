import { onBeforeUnmount, onMounted, readonly, ref } from 'vue';

const TOP_GAP = 40;

export const useSheetHeight = () => {
	const sheetHeight = ref(0);

	const update = () => {
		const viewport = window.visualViewport;
		if (!viewport) return;

		sheetHeight.value = Math.max(0, Math.round(viewport.height - TOP_GAP));
	};

	onMounted(() => {
		const viewport = window.visualViewport;
		if (!viewport) return;

		update();
		viewport.addEventListener('resize', update);
		viewport.addEventListener('scroll', update);
	});

	onBeforeUnmount(() => {
		const viewport = window.visualViewport;
		if (!viewport) return;

		viewport.removeEventListener('resize', update);
		viewport.removeEventListener('scroll', update);
	});

	return {
		sheetHeight: readonly(sheetHeight),
	};
};
