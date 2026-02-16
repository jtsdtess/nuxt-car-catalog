<script setup lang="ts">
interface Props {
  text: string
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Пояснение',
})
</script>

<template>
  <span class="info-tooltip">
    <button
      type="button"
      class="info-tooltip__trigger"
      :aria-label="`${label}: ${text}`"
      :title="label"
    >
      <span class="info-tooltip__icon" aria-hidden="true">?</span>
    </button>

    <span class="info-tooltip__bubble" role="tooltip">
      {{ text }}
    </span>
  </span>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.info-tooltip {
  display: inline-flex;
  position: relative;
}

.info-tooltip__trigger {
  align-items: center;
  appearance: none;
  background-color: $color-surface;
  border: 1px solid $color-border-soft;
  border-radius: 999px;
  color: $color-text-secondary;
  cursor: help;
  display: inline-flex;
  height: 20px;
  justify-content: center;
  padding: 0;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
  width: 20px;

  &:hover {
    background-color: $color-bg;
    border-color: $color-border;
    color: $color-text;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.info-tooltip__icon {
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
}

.info-tooltip__bubble {
  background-color: $color-text;
  border-radius: $radius-sm;
  bottom: calc(100% + #{$space-2});
  color: $color-surface;
  font-size: 0.75rem;
  left: 50%;
  line-height: 1.4;
  max-width: min(300px, calc(100vw - #{$space-8}));
  opacity: 0;
  padding: $space-2 $space-3;
  pointer-events: none;
  position: absolute;
  transform: translate(-50%, 2px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  visibility: hidden;
  white-space: normal;
  width: max-content;
  z-index: 20;
}

.info-tooltip:hover .info-tooltip__bubble,
.info-tooltip:focus-within .info-tooltip__bubble {
  opacity: 1;
  transform: translate(-50%, 0);
  visibility: visible;
}
</style>

