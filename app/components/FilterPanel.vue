<script setup lang="ts">
interface Props {
  makes: string[]
  selectedMake: string
  yearFrom: number | null
  yearTo: number | null
}

interface Emits {
  (e: 'update:selectedMake', value: string): void
  (e: 'update:yearFrom' | 'update:yearTo', value: number | null): void
  (e: 'reset'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const minYear = 2000
const maxYear = new Date().getFullYear() + 1
</script>

<template>
  <div class="filters-panel">
    <div class="filters-panel__header">
      <h3 class="filters-panel__title">Filters</h3>
      <button
        v-if="selectedMake || yearFrom || yearTo"
        class="filters-panel__reset"
        @click="emit('reset')"
      >
        Reset
      </button>
    </div>

    <div class="filters-panel__fields">
      <div class="filters-panel__field">
        <label for="make" class="filters-panel__label">Make</label>
        <select
          id="make"
          :value="selectedMake"
          class="filters-panel__input"
          @change="emit('update:selectedMake', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All makes</option>
          <option v-for="make in makes" :key="make" :value="make">
            {{ make }}
          </option>
        </select>
      </div>

      <div class="filters-panel__grid">
        <div class="filters-panel__field">
          <label for="yearFrom" class="filters-panel__label">Year from</label>
          <input
            id="yearFrom"
            type="number"
            :min="minYear"
            :max="maxYear"
            :value="yearFrom ?? ''"
            placeholder="From"
            class="filters-panel__input"
            @input="
              emit(
                'update:yearFrom',
                ($event.target as HTMLInputElement).value
                  ? Number(($event.target as HTMLInputElement).value)
                  : null,
              )
            "
          >
        </div>
        <div class="filters-panel__field">
          <label for="yearTo" class="filters-panel__label">Year to</label>
          <input
            id="yearTo"
            type="number"
            :min="minYear"
            :max="maxYear"
            :value="yearTo ?? ''"
            placeholder="To"
            class="filters-panel__input"
            @input="
              emit(
                'update:yearTo',
                ($event.target as HTMLInputElement).value
                  ? Number(($event.target as HTMLInputElement).value)
                  : null,
              )
            "
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.filters-panel {
  background-color: $color-surface;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.filters-panel__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: $space-4;
}

.filters-panel__title {
  color: $color-text;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.filters-panel__reset {
  background: none;
  border: none;
  color: $color-primary;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: $color-primary-hover;
  }

  &:focus-visible {
    @include focus-ring(rgba($color-primary, 0.25));
    border-radius: $radius-sm;
  }
}

.filters-panel__fields {
  display: grid;
  gap: $space-3;
}

.filters-panel__field {
  display: grid;
  gap: $space-1;
}

.filters-panel__label {
  color: $color-text-secondary;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
}

.filters-panel__grid {
  display: grid;
  gap: $space-3;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.filters-panel__input {
  appearance: none;
  background-color: $color-surface;
  border: 1px solid $color-border-soft;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  color: $color-text;
  font-size: 0.95rem;
  line-height: 1.4;
  padding: 9px $space-3;
  width: 100%;

  &:focus {
    border-color: $color-primary;
    @include focus-ring(rgba($color-primary, 0.25));
  }
}
</style>

