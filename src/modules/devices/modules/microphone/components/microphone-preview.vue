<template>
    <wt-load-bar 
        :value="volumeLevel" 
        max="100" 
        color="info"
    />
</template>

<script setup lang="ts">
import { WtLoadBar } from '@webitel/ui-sdk/components';
import { onMounted, onUnmounted, watch } from 'vue';
    
import { useMicrophoneVolume } from '../composables/useMicrophoneVolume';

const { stream } = defineProps<{
    stream: MediaStream | null;
}>();

const emit = defineEmits<{
	requestStream: [];
}>();

const {
	volumeLevel,
	start: startVolumeMonitoring,
	stop: stopVolumeMonitoring,
} = useMicrophoneVolume();

onMounted(() => {
    if (!stream) {
        emit('requestStream');
	} else {
        startVolumeMonitoring(stream);
    }
});

onUnmounted(() => {
    stopVolumeMonitoring();
});

watch(() => stream, (newStream) => {
    if (newStream) {
        stopVolumeMonitoring();
        startVolumeMonitoring(newStream);
    }
});

</script>