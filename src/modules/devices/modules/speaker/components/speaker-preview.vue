<template>
  
  <wt-button
      color="secondary"
      :disabled="!deviceId || isPlaying"
      @click="playBeep"
    >
      {{ t('reusable.check').toUpperCase() }}
    </wt-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { WtButton } from '@webitel/ui-sdk/components';

const { deviceId } = defineProps<{
	deviceId?: string | null;
}>();

const { t } = useI18n();

const isPlaying = ref(false);

async function playBeep() {
	if (isPlaying.value || !deviceId) return;

	try {
		isPlaying.value = true;
		await generateBeep(deviceId);
	} catch (error) {
		console.error('Error playing beep:', error);
	} finally {
		isPlaying.value = false;
	}
}

/**
 * Generate and play beep sound for speaker
 */

async function generateBeep(deviceId: string) {
	try {
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
		if ('setSinkId' in audioContext && deviceId) {
			try {
				await (audioContext as any).setSinkId(deviceId);
			} catch (err) {
				console.warn('setSinkId not supported or failed:', err);
			}
		}

		oscillator.start(now);
		oscillator.stop(now + 0.3);

		// Wait for beep to finish before closing context
		await new Promise((resolve) => setTimeout(resolve, 350));
		await audioContext.close();
	} catch (err) {
		console.error('Error playing beep:', err);
		throw err;
	}
}
</script>