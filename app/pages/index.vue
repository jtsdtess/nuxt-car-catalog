<script setup lang="ts">
import { useCarsStore } from '../stores/cars'
import { useCarFilters } from '../composables/useCarFilters'

useHead({
  title: 'Car Catalog',
})

const carsStore = useCarsStore()
const { search, make, yearFrom, yearTo, reset: resetFilters } = useCarFilters()

await carsStore.fetchCars()

const makes = computed(() => {
  const uniqueMakes = new Set(carsStore.cars.map(car => car.make))
  return Array.from(uniqueMakes).sort()
})

const filteredCars = computed(() => {
  let result = [...carsStore.cars]

  const searchValue = search.value.toLowerCase().trim()
  if (searchValue) {
    result = result.filter(car =>
      car.make.toLowerCase().includes(searchValue) ||
      car.model.toLowerCase().includes(searchValue),
    )
  }

  if (make.value) {
    result = result.filter(car => car.make === make.value)
  }

  if (yearFrom.value) {
    result = result.filter(car => car.year >= yearFrom.value!)
  }

  if (yearTo.value) {
    result = result.filter(car => car.year <= yearTo.value!)
  }

  return result
})
</script>

<template>
  <main class="catalog-page">
    <div class="catalog-page__layout">
      <aside class="catalog-page__sidebar">
        <div class="catalog-page__sidebar-stack">
          <SearchBar v-model="search" />
          <FilterPanel
            :makes="makes"
            :selected-make="make"
            :year-from="yearFrom"
            :year-to="yearTo"
            @update:selected-make="make = $event"
            @update:year-from="yearFrom = $event"
            @update:year-to="yearTo = $event"
            @reset="resetFilters"
          />
          <div class="catalog-page__summary">
            <p class="catalog-page__summary-text">
              Showing
              <span class="catalog-page__summary-number">{{ filteredCars.length }}</span>
              of
              <span class="catalog-page__summary-number">{{ carsStore.cars.length }}</span>
              cars
            </p>
          </div>
        </div>
      </aside>

      <section class="catalog-page__content">
        <LoadingSpinner v-if="carsStore.loading" size="lg" />

        <ErrorMessage
          v-else-if="carsStore.error"
          :message="carsStore.error"
          :on-retry="carsStore.fetchCars"
        />

        <div v-else-if="filteredCars.length === 0" class="catalog-page__empty">
          <svg
            class="catalog-page__empty-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 class="catalog-page__empty-title">No cars found</h3>
          <p class="catalog-page__empty-text">Try adjusting your filters or search query.</p>
        </div>

        <div v-else class="catalog-page__grid">
          <CarCard
            v-for="car in filteredCars"
            :key="car.id"
            :car="car"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.catalog-page {
  @include page-container;
  padding-bottom: $space-8;
  padding-top: $space-8;
}

.catalog-page__layout {
  display: grid;
  gap: $space-8;
  grid-template-columns: minmax(0, 1fr);
}

.catalog-page__sidebar {
  min-width: 0;
}

.catalog-page__sidebar-stack {
  display: grid;
  gap: $space-4;
}

.catalog-page__summary {
  background-color: $color-surface;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.catalog-page__summary-text {
  color: $color-text-secondary;
  font-size: 0.875rem;
  margin: 0;
}

.catalog-page__summary-number {
  color: $color-text;
  font-weight: 600;
}

.catalog-page__content {
  min-width: 0;
}

.catalog-page__empty {
  background-color: $color-surface;
  border: 2px dashed $color-border;
  border-radius: $radius-md;
  padding: $space-12;
  text-align: center;
}

.catalog-page__empty-icon {
  color: #d1d5db;
  display: block;
  height: 48px;
  margin: 0 auto;
  width: 48px;
}

.catalog-page__empty-title {
  color: $color-text;
  font-size: 1.125rem;
  font-weight: 500;
  margin: $space-4 0 0;
}

.catalog-page__empty-text {
  color: $color-text-muted;
  font-size: 0.875rem;
  margin: $space-2 0 0;
}

.catalog-page__grid {
  display: grid;
  gap: $space-6;
  grid-template-columns: minmax(0, 1fr);
}

@include up($bp-sm) {
  .catalog-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include up($bp-lg) {
  .catalog-page__layout {
    grid-template-columns: minmax(260px, 1fr) minmax(0, 3fr);
  }
}

@include up($bp-xl) {
  .catalog-page__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

