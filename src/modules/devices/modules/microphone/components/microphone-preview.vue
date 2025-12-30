<template>
    <wt-load-bar 
        :value="volumeLevel" 
        max="100" 
        color="info"
    />
</template>

<script setup lang="ts">
import { WtLoadBar } from '@webitel/ui-sdk/components';
import { watch, ref, computed, onUnmounted } from 'vue';

import {
	cleanupStream,
	getStreamFromDeviceId,
} from '../../../scripts/mediaStreamUtils';
import { UserDeviceType } from '../../../enums/UserDeviceType';

import { useMicrophoneVolume } from '../composables/useMicrophoneVolume';

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

const {
	volumeLevel,
	start: startVolumeMonitoring,
	stop: stopVolumeMonitoring,
} = useMicrophoneVolume();

watch(
	() => deviceId,
	async (newDeviceId) => {
		tryCleanupLocalStream();

		if (newDeviceId) {
			localStream.value = await getStreamFromDeviceId({
				deviceId: newDeviceId,
				deviceType: UserDeviceType.Audio,
			});
		}
	},
	{
		immediate: true,
	},
);

watch(previewStream, (newStream) => {
	if (newStream) {
		stopVolumeMonitoring();
		startVolumeMonitoring(newStream);
	}
});

onUnmounted(() => {
	tryCleanupLocalStream();
	stopVolumeMonitoring();
});
</script>