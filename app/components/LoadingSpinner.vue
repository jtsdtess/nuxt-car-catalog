<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })

const spinnerSizeClass = computed(() => `loading-spinner__icon--${props.size}`)
</script>

<template>
  <div class="loading-spinner">
    <svg
      :class="['loading-spinner__icon', spinnerSizeClass]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="loading-spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="loading-spinner__head"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;

.loading-spinner {
  align-items: center;
  display: flex;
  justify-content: center;
}

.loading-spinner__icon {
  animation: spinner-rotate 0.8s linear infinite;
  color: $color-primary;
}

.loading-spinner__icon--sm {
  height: 16px;
  width: 16px;
}

.loading-spinner__icon--md {
  height: 32px;
  width: 32px;
}

.loading-spinner__icon--lg {
  height: 48px;
  width: 48px;
}

.loading-spinner__track {
  opacity: 0.25;
}

.loading-spinner__head {
  opacity: 0.75;
}

@keyframes spinner-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

