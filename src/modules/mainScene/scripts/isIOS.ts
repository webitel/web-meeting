export const isIOS = (): boolean => {
	if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;

	return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};
