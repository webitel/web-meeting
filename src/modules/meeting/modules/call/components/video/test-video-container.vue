<template>
    <!-- FOR TEST PURPOSES ONLY!! -->
    <div class="video-container">
        <div class="video-wrapper remote-video">
            <video :srcObject.prop="remoteVideoStream" autoplay playsinline />
            <span class="video-label">Remote</span>
        </div>
        <div class="video-wrapper local-video">
            <video :srcObject.prop="localVideoStream" autoplay playsinline muted />
            <span class="video-label">You</span>
        </div>
    </div>
</template>

<script setup lang="ts">
// FOR TEST PURPOSES ONLY!!
import { storeToRefs } from 'pinia';

import { useCallStore } from '../../../call/store/call';

const callStore = useCallStore();

const { remoteVideoStream, localVideoStream } = storeToRefs(callStore);
</script>

<style scoped>


.video-container {
    position: relative;
    margin: 20px 0;
    background-color: #000;
    border-radius: 12px;
    overflow: hidden;
}

.video-wrapper {
    position: relative;
}

.video-wrapper.remote-video {
    width: 100%;
    aspect-ratio: 16/9;
    background-color: #1a1a1a;
}

.video-wrapper.local-video {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 200px;
    aspect-ratio: 4/3;
    background-color: #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-label {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}
</style>