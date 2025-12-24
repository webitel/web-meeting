export async function getStreamFromDeviceId({
	deviceId,
	deviceType,
}: {
	deviceId: string;
	deviceType: 'video' | 'audio';
}): Promise<MediaStream | null> {
	const stream = await navigator.mediaDevices.getUserMedia({
		[deviceType]: {
			deviceId: {
				exact: deviceId,
			},
		},
	});

	return stream;
}

export function cleanupStream(stream: MediaStream): void {
	stream.getTracks().forEach((track) => track.stop());
}

/**
 * Cant just return stream, coz this fn handles multiple tracks
 */
export async function getDeviceStreamTrack(deviceId: string): Promise<{
	stream: MediaStream;
	track: MediaStreamTrack;
}> {
	const deviceStream = await getStreamFromDeviceId({
		deviceId,
		deviceType: 'video',
	});
	if (!deviceStream) {
		throw new Error(`Failed to get MediaStream from device ${deviceId}`);
	}

	const deviceVideoTrack = getVideoTrackFromStream(deviceStream);
	if (!deviceVideoTrack) {
		throw new Error(
			`Failed to get MediaStreamTrack of MediaStream from device ${deviceId}`,
		);
	}

	return {
		stream: deviceStream,
		track: deviceVideoTrack,
	};
}

export function getVideoTrackFromStream(
	stream: MediaStream,
): MediaStreamTrack | null {
	const videoTracks = stream.getVideoTracks();

	return handleMultipleTracks(videoTracks);
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

	return videoTracks[0]!;
}
