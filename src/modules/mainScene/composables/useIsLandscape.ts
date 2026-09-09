import { onBeforeUnmount, onMounted, readonly, ref } from 'vue';

export const useIsLandscape = () => {
	const isLandscape = ref(false);

	const query = window.matchMedia('(orientation: landscape)');

	const update = () => {
		isLandscape.value = query.matches;
	};

	onMounted(() => {
		update();
		query.addEventListener('change', update);
	});

	onBeforeUnmount(() => {
		query.removeEventListener('change', update);
	});

	return {
		isLandscape: readonly(isLandscape),
	};
};
