<template>
    <wt-single-select
        :model-value="deviceId"
        :options="devicesList"
        :label="label"
        :show-clear="false"
        option-label="label"
        data-key="deviceId"
        option-value="deviceId"
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
const deviceId = defineModel<string | null>('deviceId', {
	required: true,
});

const { options: devicesList, label } = defineProps<{
	options: MediaDeviceInfo[];
	label: string;
}>();
</script>