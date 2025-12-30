/**
 * @author dlohvinov
 *
 * @see [WTEL-8408](https://webitel.atlassian.net/browse/WTEL-8408)
 *
 * @see https://github.com/webitel/web-meeting/blob/main/snippets.md#apply-specific-camera-settings
 */

export const applyVideoTrackResolution = (track: MediaStreamTrack) => {
	track.applyConstraints({
		width: {
			ideal: 64,
		},
		height: {
			ideal: 64,
		},
		frameRate: {
			ideal: 30,
		},
	});
};
