<template>
    <div class="device-group">
        <label for="camera-select">Camera:</label>
        <select id="camera-select" :value="modelValue" @change="handleChange">
            <option value="">Select Camera</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                {{ device.label || `Camera ${device.deviceId.slice(0, 8)}` }}
            </option>
        </select>

        <div v-if="modelValue" class="test-section">
            <label class="test-label">Camera Preview:</label>
            <div class="video-container">
                <video ref="videoElement" autoplay playsinline muted class="video-preview" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

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

const videoElement = ref<HTMLVideoElement | null>(null);
let stream: MediaStream | null = null;

function handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    emit('update:modelValue', value);
    emit('change', value);
}

async function startCameraPreview(deviceId: string): Promise<void> {
    try {
        // Stop any existing stream
        stopCameraPreview();

        // Get camera stream
        stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });

        // Attach stream to video element
        if (videoElement.value) {
            videoElement.value.srcObject = stream;
        }
    } catch (error) {
        console.error('Error starting camera preview:', error);
    }
}

function stopCameraPreview(): void {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    if (videoElement.value) {
        videoElement.value.srcObject = null;
    }
}

// Watch for device changes
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        startCameraPreview(newValue);
    } else {
        stopCameraPreview();
    }
});

// Cleanup on unmount
onUnmounted(() => {
    stopCameraPreview();
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
