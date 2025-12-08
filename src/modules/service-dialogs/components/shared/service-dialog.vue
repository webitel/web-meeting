<template>
    <section
     :class="[`service-dialog--size-${size}`]"
     class="service-dialog"
     >
        <header class="service-dialog__header">
            <slot name="header">
                <h2 class="service-dialog__title">
                    <slot name="title" />
                </h2>
            </slot>
        </header>
        <main class="service-dialog__main">
            <slot name="main" />
        </main>
        <footer class="service-dialog__footer">
            <slot name="footer">
                <div class="service-dialog__actions">
                    <slot name="actions" />
                </div>
            </slot>
        </footer>
    </section>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
	}>(),
	{
		size: ComponentSize.MD,
	},
);
</script>

<style scoped>
.service-dialog {
  display: flex;
  width: 400px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--wt-page-wrapper-content-wrapper-color);
  border-radius: var(--border-radius);
}

.service-dialog--size-sm,
.service-dialog--size-md {
  width: 400px;
  height: 400px;
}

.service-dialog--size-lg {
  width: 100%;
  height: 100%;
}
</style>
