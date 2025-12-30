export async function forceSenderVideoHighQuality(sender: RTCRtpSender) {
	try {
		const desiredEncodingParameters: RTCRtpEncodingParameters = {
			priority: 'high',
			networkPriority: 'high',
			maxBitrate: 4000 * 100 * 1000, // 4000kbps
		};

		const senderParameters = sender.getParameters();

		senderParameters.degradationPreference = 'maintain-resolution';

		if (!senderParameters.encodings?.length) {
			senderParameters.encodings = [
				desiredEncodingParameters,
			];
		} else {
			Object.assign(
				senderParameters.encodings.at(0)!,
				desiredEncodingParameters,
			);
		}

		await sender.setParameters(senderParameters);
	} catch (err) {
		console.error('Failed to force sender video high quality:', err);
		// throw err; dont throw error, just log it
	}
}
