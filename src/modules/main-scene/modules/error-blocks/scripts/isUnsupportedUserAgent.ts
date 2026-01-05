/**
 * Show error-wall message if user is using mobile
 *
 * @see [WTEL-8560](https://webitel.atlassian.net/browse/WTEL-8560)
 *
 * @see [Browser detection using the user agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent#mobile_tablet_or_desktop)
 */
export const isUnsupportedUserAgent = () => {
	return navigator.userAgent.includes('Mobi');
};
