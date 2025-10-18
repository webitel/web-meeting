<template>
    <div class="device-group">
        <label for="microphone-select">Microphone:</label>
        <select
         id="microphone-select" 
         :value="selectedDeviceId" 
         @change="setSelectedDevice(($event.target as HTMLSelectElement).value)"
         >
            <option value="">Select Microphone</option>
            <option
                 v-for="device of devices" 
                :key="device.deviceId" 
                :value="device.deviceId"
             >
                {{ device.label || `Microphone ${device.deviceId.slice(0, 8)}` }}
            </option>
        </select>

        <div v-if="selectedDeviceId" class="test-section">
            <label class="test-label">Microphone Level:</label>
        
                <wt-load-bar max="100" :value="volumeLevel" />
        
        
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onUnmounted, onMounted } from 'vue';

import { useMicrophoneStore } from '../stores/microphone';
import { useMicrophoneVolume } from '../composables/useMicrophoneVolume';

const microphoneStore = useMicrophoneStore();

const { 
    devices, 
    selectedDeviceId, 
    stream,
} = storeToRefs(microphoneStore);

const { 
    startStream, 
    stopStream, 
    setSelectedDevice,
    cleanup,
 } = microphoneStore;

const { 
    volumeLevel, 
    start: startVolumeMonitoring, 
    stop: stopVolumeMonitoring,
 } = useMicrophoneVolume();

watch(selectedDeviceId, async (newDeviceId) => {
    if (stream.value) {
        stopStream();
        stopVolumeMonitoring();
    }

    if (!newDeviceId) return;

    await startStream();
    
    if (!stream.value) return;
    
    startVolumeMonitoring(stream.value);
}, { immediate: true });

onUnmounted(() => {
    stopVolumeMonitoring();
    cleanup();
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
</style>
