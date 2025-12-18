import { onUnmounted, ref } from 'vue';

export function useMicrophoneVolume() {
	const volumeLevel = ref<number>(0);

	let audioContext: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let microphone: MediaStreamAudioSourceNode | null = null;
	let animationId: number | null = null;

	function start(stream: MediaStream): void {
		// Stop any existing analysis
		stop();

		// Create audio context and analyser
		audioContext = new AudioContext();
		analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;

		microphone = audioContext.createMediaStreamSource(stream);
		microphone.connect(analyser);

		// Start analyzing volume
		const dataArray = new Uint8Array(analyser.fftSize);

		const updateVolume = () => {
			if (!analyser) return;

			analyser.getByteTimeDomainData(dataArray);

			let sumSquares = 0;
			for (let i = 0; i < dataArray.length; i++) {
				const value = (dataArray[i] - 128) / 128;
				sumSquares += value * value;
			}

			// Calculate average volume (1-100)
			const average = Math.sqrt(sumSquares / dataArray.length);
			const newValue = Math.min(100, Math.round(average * 300));

			volumeLevel.value = Math.round(volumeLevel.value * 0.7 + newValue * 0.3);

			animationId = requestAnimationFrame(updateVolume);
		};

		updateVolume();
	}

	function stop(): void {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}

		if (microphone) {
			microphone.disconnect();
			microphone = null;
		}

		if (analyser) {
			analyser.disconnect();
			analyser = null;
		}

		if (audioContext) {
			audioContext.close();
			audioContext = null;
		}

		volumeLevel.value = 0;
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop();
	});

	return {
		volumeLevel,
		start,
		stop,
	};
}
