import { shouldRequestPermissions } from './shouldRequestPermissions';

export const isFirefox = () => navigator.userAgent.includes('Firefox');

/**
 * @author: dlohvinov
 *
 * firefox has its own specifics (privacy feature) that prevents enumeration
 * of devices without getUserMedia() call. So that, vueuse/useDevicesList()
 * is showing that application has devices access, but no devices are present.
 *
 * @see [WTEL-8544](https://webitel.atlassian.net/browse/WTEL-8544?focusedCommentId=717571)
 */
export async function forceFirefoxToEnumerateDevices() {
	if (!isFirefox() || !shouldRequestPermissions()) return;

	await navigator.mediaDevices.getUserMedia({
		audio: true,
		video: true,
	});
}
