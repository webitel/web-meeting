<template>
    <div class="device-group">
        <label for="speaker-select">Speaker:</label>
        <select
            id="speaker-select"
            :value="selectedDeviceId"
            @change="setSelectedDevice(($event.target as HTMLSelectElement).value)"
        >
            <option value="">Select Speaker</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                {{ device.label || `Speaker ${device.deviceId.slice(0, 8)}` }}
            </option>
        </select>

        <div class="test-section">
            <button @click="playBeep" :disabled="isPlaying" class="test-button">
                {{ isPlaying ? 'Playing...' : '🔊 Test Speaker' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSpeakerStore } from '../stores/speaker';
const speakerStore = useSpeakerStore();

const { 
    devices, 
    selectedDeviceId, 
} = storeToRefs(speakerStore);

const { 
    setSelectedDevice,
    playTestBeep,
 } = speakerStore;

const isPlaying = ref(false);

async function playBeep(): Promise<void> {
    if (isPlaying.value || !selectedDeviceId.value) return;

    try {
        isPlaying.value = true;
        await playTestBeep(selectedDeviceId.value);
    } catch (error) {
        console.error('Error playing beep:', error);
    } finally {
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
