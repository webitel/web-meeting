import { ref, onUnmounted } from 'vue';

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
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume (1-100)
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      volumeLevel.value = Math.round((average / 255) * 100);

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
