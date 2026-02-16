<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="search-bar">
    <input
      :value="modelValue"
      type="text"
      placeholder="Search by make or model..."
      class="search-bar__input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <svg
      class="search-bar__icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.search-bar {
  position: relative;
}

.search-bar__input {
  border: 1px solid $color-border-soft;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  color: $color-text;
  display: block;
  font-size: 0.95rem;
  padding: 10px 40px 10px $space-4;
  transition: border-color 0.2s ease;
  width: 100%;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: $color-primary;
    @include focus-ring(rgba($color-primary, 0.25));
  }
}

.search-bar__icon {
  color: #9ca3af;
  height: 20px;
  pointer-events: none;
  position: absolute;
  right: $space-3;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
}
</style>

