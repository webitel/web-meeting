<template>
    <wt-select
        :value="deviceId"
        :options="devicesList"
        :label="label"
        option-label="label"
        track-by="deviceId"
        use-value-from-options-by-prop="deviceId"
        @update:model-value="deviceId = $event"
    />
</template>

<script setup lang="ts">
/**
 * @author: dlohvinov
 *
 * This component is shared,
 * coz devices codebase are shared too
 */
const deviceId = defineModel<string>('deviceId', {
	required: true,
});

const { options: devicesList, label } = defineProps<{
	options: MediaDeviceInfo[];
	label: string;
}>();
</script>