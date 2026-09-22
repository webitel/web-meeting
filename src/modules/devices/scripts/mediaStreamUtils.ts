import { getConfig } from '../../appConfig/config';
import { UserDeviceType } from '../enums/UserDeviceType';

export async function getStreamFromDeviceId({
	deviceId,
	deviceType,
}: {
	deviceId: string | null;
	deviceType: UserDeviceType;
}): Promise<MediaStream | null> {
	const $config = await getConfig();

	const constraints: MediaTrackConstraints = {};

	if (deviceId) {
		constraints.deviceId = {
			exact: deviceId,
		};
	}

	if (deviceType === UserDeviceType.Video) {
		constraints.width = {
			ideal: $config.call.videoDeviceResolution?.width?.ideal ?? 1920,
		};
		constraints.height = {
			ideal: $config.call.videoDeviceResolution?.height?.ideal ?? 1080,
		};
	}

	const stream = await navigator.mediaDevices.getUserMedia({
		[deviceType]: constraints,
	});

	return stream;
}

export function cleanupStream(stream: MediaStream): void {
	stream.getTracks().forEach((track) => {
		track.stop();
	});
}

/**
 * Cant just return stream, coz this fn handles multiple tracks
 */
export function getMediaStreamMainTrack({
	stream: deviceStream,
	deviceType,
}: {
	stream: MediaStream;
	deviceType: UserDeviceType;
}): MediaStreamTrack | null {
	if (!deviceStream) {
		throw new Error(
			`Failed to get MediaStream from device with type ${deviceType}`,
		);
	}

	if (deviceType === UserDeviceType.Video) {
		return getVideoTrackFromStream(deviceStream);
	}
	if (deviceType === UserDeviceType.Audio) {
		return getAudioTrackFromStream(deviceStream);
	}

	throw new Error(
		`Failed to get MediaStreamTrack of MediaStream from device with type ${deviceType}`,
	);
}

function getVideoTrackFromStream(stream: MediaStream): MediaStreamTrack | null {
	const videoTracks = stream.getVideoTracks();

	return handleMultipleTracks(videoTracks);
}

function getAudioTrackFromStream(stream: MediaStream): MediaStreamTrack | null {
	const audioTracks = stream.getAudioTracks();

	return handleMultipleTracks(audioTracks);
}

/**
 *
 * returns only one video track if there are many (coz stream.getVideoTracks() returns array)
 */
function handleMultipleTracks(
	videoTracks: MediaStreamTrack[],
): MediaStreamTrack | null {
	if (videoTracks.length === 0) {
		return null;
	}

	if (videoTracks.length > 1) {
		console.warn(
			`getUserMedia returned ${videoTracks.length} video tracks, using the first one`,
		);
	}

	return videoTracks[0] ?? null;
}
