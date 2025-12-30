<template>
    <video
        class="camera-settings__video" 
        :srcObject="previewStream"
        autoplay
        playsinline
        muted
    />
</template>

<script setup lang="ts">
import { watch, ref, computed, onUnmounted } from 'vue';
import {
	cleanupStream,
	getStreamFromDeviceId,
} from '../../../scripts/mediaStreamUtils';
import { UserDeviceType } from '../../../enums/UserDeviceType';

const { stream: callStream, deviceId } = defineProps<{
	deviceId: string;
	/**
	 * @author: dlohvinov
	 *
	 * active call stream to use as preview,
	 * if present!
	 */
	stream?: MediaStream | null;
}>();

const localStream = ref<MediaStream | null>(null);

const previewStream = computed(() => {
	return callStream || localStream.value;
});

function tryCleanupLocalStream() {
	localStream.value && cleanupStream(localStream.value);
	localStream.value = null;
}

watch(
	() => deviceId,
	async (newDeviceId) => {
		tryCleanupLocalStream();

		if (newDeviceId) {
			localStream.value = await getStreamFromDeviceId({
				deviceId: newDeviceId,
				deviceType: UserDeviceType.Video,
			});
		}
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	tryCleanupLocalStream();
});
</script>

<style scoped>
.camera-settings__video {
    border-radius: var(--spacing-sm);
}
</style>