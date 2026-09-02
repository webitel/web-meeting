import InAppSpy from 'inapp-spy';

const { isInApp } = InAppSpy();

export const isInAppWebView = (): boolean => {
	return isInApp;
};
