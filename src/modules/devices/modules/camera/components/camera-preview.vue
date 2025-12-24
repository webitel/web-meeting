<template>
    <video
        class="camera-settings__video" 
        :srcObject="stream"
        autoplay
        playsinline
        muted
    />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const { stream } = defineProps<{
	stream: MediaStream | null;
}>();

const emit = defineEmits<{
	requestStream: [];
}>();

onMounted(() => {
	if (!stream) {
		emit('requestStream');
	}
});
</script>

<style scoped>
.camera-settings__video {
    border-radius: var(--spacing-sm);
}
</style>