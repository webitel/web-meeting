<template>
    <div class="device-group">
        <label for="camera-select">Camera:</label>
        <select id="camera-select" :value="selectedDeviceId" @change="setSelectedDevice(($event.target as HTMLSelectElement).value)">
            <option value="">Select Camera</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                {{ device.label || `Camera ${device.deviceId.slice(0, 8)}` }}
            </option>
        </select>

        <div class="test-section">
            <label class="test-label">Camera Preview:</label>
            <div class="video-container">
                <video
                 :srcObject="stream" ref="cameraPreviewElement" autoplay playsinline muted class="video-preview" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useCameraStore } from '../stores/camera';

const cameraStore = useCameraStore();

const { 
    devices, 
    selectedDeviceId, 
    stream,
} = storeToRefs(cameraStore);

const { 
    startStream, 
    stopStream, 
    setSelectedDevice,
    cleanup,
 } = cameraStore;

watch(selectedDeviceId, async (newDeviceId) => {
    if (stream.value) {
        stopStream();
    }

    if (!newDeviceId) return;

    await startStream();
}, { immediate: true });

onUnmounted(() => {
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

.video-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #000;
    border-radius: 4px;
    overflow: hidden;
}

.video-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
