<template>
    <div class="device-group">
        <label for="speaker-select">Speaker:</label>
        <select id="speaker-select" :value="modelValue" @change="handleChange">
            <option value="">Select Speaker</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                {{ device.label || `Speaker ${device.deviceId.slice(0, 8)}` }}
            </option>
        </select>

        <div v-if="modelValue" class="test-section">
            <button @click="playBeep" :disabled="isPlaying" class="test-button">
                {{ isPlaying ? 'Playing...' : '🔊 Test Speaker' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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

const isPlaying = ref<boolean>(false);

function handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    emit('update:modelValue', value);
    emit('change', value);
}

async function playBeep(): Promise<void> {
    if (isPlaying.value) return;

    try {
        isPlaying.value = true;

        // Create audio context
        const audioContext = new AudioContext();

        // Create oscillator for beep sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure beep sound (800 Hz, 300ms)
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        // Fade in and out
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

        // Try to set output device (if supported)
        if ('setSinkId' in audioContext && props.modelValue) {
            try {
                await (audioContext as any).setSinkId(props.modelValue);
            } catch (error) {
                console.warn('setSinkId not supported or failed:', error);
            }
        }

        oscillator.start(now);
        oscillator.stop(now + 0.3);

        // Wait for beep to finish
        setTimeout(() => {
            isPlaying.value = false;
            audioContext.close();
        }, 350);
    } catch (error) {
        console.error('Error playing beep:', error);
        isPlaying.value = false;
    }
}
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

.test-button {
    padding: 8px 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    transition: background-color 0.2s;
}

.test-button:hover:not(:disabled) {
    background-color: #218838;
}

.test-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
</style>
