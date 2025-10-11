<template>
    <div class="device-group">
        <label for="microphone-select">Microphone:</label>
        <select id="microphone-select" :value="modelValue" @change="handleChange">
            <option value="">Select Microphone</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                {{ device.label || `Microphone ${device.deviceId.slice(0, 8)}` }}
            </option>
        </select>

        <div v-if="modelValue" class="test-section">
            <label class="test-label">Microphone Level:</label>
            <div class="volume-meter">
                <input type="range" min="0" max="100" :value="volumeLevel" disabled class="volume-range" />
                <span class="volume-value">{{ volumeLevel }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useMicrophoneStore } from '../stores/microphone';

interface Props {
    devices: MediaDeviceInfo[];
    modelValue: string;
}

interface Emits {
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const microphoneStore = useMicrophoneStore();

const volumeLevel = ref<number>(0);
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let microphone: MediaStreamAudioSourceNode | null = null;
let animationId: number | null = null;

function handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    emit('update:modelValue', value);
    emit('change', value);
}

async function startMicrophoneTest(deviceId: string): Promise<void> {
    try {
        // Stop any existing stream
        stopMicrophoneTest();

        // Get microphone stream from store
        const stream = await microphoneStore.getStream(deviceId);
        if (!stream) return;

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

            // Calculate average volume
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            volumeLevel.value = Math.round((average / 255) * 100);

            animationId = requestAnimationFrame(updateVolume);
        };

        updateVolume();
    } catch (error) {
        console.error('Error testing microphone:', error);
    }
}

function stopMicrophoneTest(): void {
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

    // Stop stream via store
    microphoneStore.stopStream();

    volumeLevel.value = 0;
}

// Watch for device changes
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        startMicrophoneTest(newValue);
    } else {
        stopMicrophoneTest();
    }
});

// Cleanup on unmount
onUnmounted(() => {
    stopMicrophoneTest();
});
</script>

<style scoped>
.device-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.device-group label {
    font-weight: 500;
    font-size: 14px;
}

.device-group select {
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
}

.device-group select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.test-section {
    margin-top: 12px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.test-label {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 8px;
    display: block;
}

.volume-meter {
    display: flex;
    align-items: center;
    gap: 12px;
}

.volume-range {
    flex: 1;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(to right, #28a745 0%, #ffc107 50%, #dc3545 100%);
    border-radius: 4px;
    outline: none;
}

.volume-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #fff;
    border: 2px solid #007bff;
    border-radius: 50%;
    cursor: default;
}

.volume-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #fff;
    border: 2px solid #007bff;
    border-radius: 50%;
    cursor: default;
}

.volume-value {
    font-size: 14px;
    font-weight: 500;
    min-width: 40px;
    text-align: right;
}
</style>
