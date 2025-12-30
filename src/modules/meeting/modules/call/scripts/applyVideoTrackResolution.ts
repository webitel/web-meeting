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
			min: 1024, // todo: make configurable
			ideal: 1280,
			max: 1920,
		},
		height: {
			min: 776,
			ideal: 720,
			max: 1080,
		},
	});
};
