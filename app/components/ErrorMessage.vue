<script setup lang="ts">
interface Props {
  message: string
  onRetry?: () => void
}

defineProps<Props>()
</script>

<template>
  <div class="error-message">
    <svg
      class="error-message__icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <h3 class="error-message__title">Something went wrong</h3>
    <p class="error-message__text">{{ message }}</p>
    <button
      v-if="onRetry"
      class="error-message__button"
      @click="onRetry"
    >
      Try again
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.error-message {
  background-color: $color-danger-soft;
  border: 1px solid $color-danger-border;
  border-radius: $radius-md;
  padding: $space-6;
  text-align: center;
}

.error-message__icon {
  color: #f87171;
  display: block;
  height: 48px;
  margin: 0 auto;
  width: 48px;
}

.error-message__title {
  color: $color-text;
  font-size: 1.125rem;
  font-weight: 500;
  margin: $space-4 0 0;
}

.error-message__text {
  color: $color-text-secondary;
  font-size: 0.875rem;
  margin: $space-2 0 0;
}

.error-message__button {
  align-items: center;
  background-color: $color-danger;
  border: none;
  border-radius: $radius-md;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: $space-4;
  padding: 9px $space-4;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $color-danger-hover;
  }

  &:focus-visible {
    @include focus-ring(rgba($color-danger, 0.3));
  }
}
</style>

