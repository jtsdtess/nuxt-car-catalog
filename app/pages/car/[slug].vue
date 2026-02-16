<script setup lang="ts">
const route = useRoute()
const carsStore = useCarsStore()

const carSlug = computed(() => String(route.params.slug || ''))

await carsStore.fetchCars()

const car = computed(() => carsStore.getCarBySlug(carSlug.value))
const carId = computed(() => car.value?.id ?? -1)
const apiData = computed(() => car.value ? carsStore.getCarApiData(car.value.id) : undefined)
const apiError = computed(() => car.value ? carsStore.getCarApiError(car.value.id) : undefined)
const isApiEmpty = computed(() => car.value ? carsStore.isApiEmpty(car.value.id) : false)

const imageUrl = computed(() => {
  if (!car.value) return ''
  const keywords = `${car.value.make},${car.value.model},car`
  return `https://loremflickr.com/800/500/${keywords}?lock=${car.value.id}`
})

type FancyboxModule = typeof import('@fancyapps/ui')

const carGallerySelector = '[data-fancybox="car-gallery"]'
let fancyboxModule: FancyboxModule | null = null

function fetchDetailsForCurrentCar(): void {
  if (!car.value) {
    return
  }
  carsStore.fetchCarDetails(car.value.id)
}

async function initializeFancybox(): Promise<void> {
  const module = await import('@fancyapps/ui')
  await import('@fancyapps/ui/dist/fancybox/fancybox.css')

  fancyboxModule = module
  fancyboxModule.Fancybox.bind(carGallerySelector)
}

function cleanupFancybox(): void {
  if (!fancyboxModule) {
    return
  }

  fancyboxModule.Fancybox.unbind(carGallerySelector)
  fancyboxModule.Fancybox.close()
  fancyboxModule = null
}

onMounted(async () => {
  await initializeFancybox()
})

onBeforeUnmount(() => {
  cleanupFancybox()
})

// Fetch API data on mount (after potentially restored from persist)
watch(
  () => [car.value, carsStore.apiLoading] as const,
  ([car, loading]) => {
    if (loading) return // Already loading
    if (!car) return

    const cachedData = carsStore.getCarApiData(car.id)
    if (cachedData) return // Already have data

    carsStore.fetchCarDetails(car.id)
  },
  { immediate: true }
)

useHead(() => ({
  title: car.value ? `${car.value.make} ${car.value.model} ${car.value.year}` : 'Car Not Found',
}))
</script>

<template>
  <main class="car-page">
    <!-- Car not found -->
    <div v-if="!car" class="car-page__not-found">
      <svg
        class="car-page__not-found-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="car-page__not-found-title">Car not found</h3>
      <p class="car-page__not-found-text">The car you're looking for doesn't exist.</p>
      <NuxtLink to="/" class="car-page__back-link">
        Go back to catalog
      </NuxtLink>
    </div>

    <div v-else class="car-page__content">
      <!-- Breadcrumbs -->
      <nav class="car-page__breadcrumbs">
        <NuxtLink to="/" class="car-page__breadcrumbs-link">Catalog</NuxtLink>
        <svg class="car-page__breadcrumbs-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="car-page__breadcrumbs-current">{{ car.make }} {{ car.model }}</span>
      </nav>

      <!-- Header + Image -->
      <div class="car-page__hero">
        <div class="car-page__hero-card">
          <h1 class="car-page__title">{{ car.make }} {{ car.model }}</h1>
          <p class="car-page__subtitle">{{ car.year }}</p>
          <div class="car-page__facts">
            <span class="car-page__fact"
              >Brand:
              <span class="car-page__fact-value">{{ car.make }}</span></span
            >
            <br>
            <span class="car-page__fact"
              >Model:
              <span class="car-page__fact-value">{{ car.model }}</span></span
            >
            <br>
            <span class="car-page__fact"
              >Year:
              <span class="car-page__fact-value">{{ car.year }}</span></span
            >
          </div>
        </div>
        <div class="car-page__hero-card">
          <a
            :href="imageUrl"
            data-fancybox="car-gallery"
            :data-caption="`${car.make} ${car.model} ${car.year}`"
            class="car-page__hero-image-link"
          >
            <img
              :src="imageUrl"
              :alt="`${car.make} ${car.model}`"
              class="car-page__hero-image"
            >
          </a>
        </div>
      </div>

      <section class="car-page__details-grid">
        <!-- ==================== LOCAL DATA (JSON) ==================== -->
        <div class="car-page__local-data">
          <div class="car-page__local-header">
            <h2 class="car-page__section-title">Локальные данные (JSON)</h2>
            <InfoTooltip
              text="Данные берутся из локального файла app/data/cars.json через эндпоинт /api/cars."
              label="Источник локальных данных"
            />
          </div>
          <dl class="car-page__local-grid">
            <div class="car-page__local-item">
              <dt class="car-page__term">Make</dt>
              <dd class="car-page__value">{{ car.make }}</dd>
            </div>
            <div class="car-page__local-item">
              <dt class="car-page__term">Model</dt>
              <dd class="car-page__value">{{ car.model }}</dd>
            </div>
            <div class="car-page__local-item">
              <dt class="car-page__term">Year</dt>
              <dd class="car-page__value">{{ car.year }}</dd>
            </div>
            <div v-if="car.bodyType" class="car-page__local-item">
              <dt class="car-page__term">Body Type</dt>
              <dd class="car-page__value">{{ car.bodyType }}</dd>
            </div>
            <div v-if="car.fuelType" class="car-page__local-item">
              <dt class="car-page__term">Fuel Type</dt>
              <dd class="car-page__value">{{ car.fuelType }}</dd>
            </div>
          </dl>
        </div>

        <!-- ==================== API DATA (CarQuery) ==================== -->
        <CarApiDetails
          :api-data="apiData ?? {}"
          :api-loading="carsStore.apiLoading"
          :api-error="apiError"
          :is-api-empty="isApiEmpty"
          :car-id="carId"
          @retry="fetchDetailsForCurrentCar"
        />
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.car-page {
  @include page-container;
  padding-bottom: $space-8;
  padding-top: $space-8;
}

.car-page__not-found {
  background-color: $color-surface;
  border: 2px dashed $color-border;
  border-radius: $radius-md;
  padding: $space-12;
  text-align: center;
}

.car-page__not-found-icon {
  color: #d1d5db;
  display: block;
  height: 48px;
  margin: 0 auto;
  width: 48px;
}

.car-page__not-found-title {
  color: $color-text;
  font-size: 1.125rem;
  font-weight: 500;
  margin: $space-4 0 0;
}

.car-page__not-found-text {
  color: $color-text-muted;
  font-size: 0.875rem;
  margin: $space-2 0 0;
}

.car-page__back-link {
  align-items: center;
  background-color: $color-primary;
  border-radius: $radius-md;
  color: #fff;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: $space-4;
  padding: 9px $space-4;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $color-primary-hover;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.car-page__content {
  display: grid;
  gap: $space-8;
}

.car-page__breadcrumbs {
  align-items: center;
  color: $color-text-secondary;
  display: flex;
  font-size: 0.875rem;
  gap: $space-2;
}

.car-page__breadcrumbs-link {
  transition: color 0.2s ease;

  &:hover {
    color: $color-text;
  }
}

.car-page__breadcrumbs-separator {
  height: 16px;
  width: 16px;
}

.car-page__breadcrumbs-current {
  color: $color-text;
}

.car-page__hero {
  display: grid;
  gap: $space-6;
  grid-template-columns: minmax(0, 1fr);
}

.car-page__hero-card {
  background-color: $color-surface;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  padding: $space-6;
}

.car-page__title {
  color: $color-text;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.car-page__subtitle {
  color: $color-text-secondary;
  font-size: 1.125rem;
  margin: $space-1 0 0;
}

.car-page__facts {
  margin-top: $space-6;
}

.car-page__fact {
  color: $color-text-secondary;
  font-size: 1.125rem;
}

.car-page__fact-value {
  color: $color-text;
  font-size: 0.875rem;
  font-weight: 500;
}

.car-page__hero-image {
  border-radius: $radius-md;
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.car-page__hero-image-link {
  border-radius: $radius-md;
  cursor: zoom-in;
  display: block;
  height: 100%;
  overflow: hidden;
}

.car-page__details-grid {
  display: grid;
  gap: $space-6;
  grid-template-columns: minmax(0, 1fr);
}

.car-page__local-data {
  background-color: $color-warning-soft;
  border: 1px solid $color-warning-border;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  padding: $space-6;
}

.car-page__local-header {
  align-items: center;
  display: flex;
  gap: $space-2;
  margin-bottom: $space-4;
}

.car-page__section-title {
  color: $color-text;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.car-page__local-grid {
  display: grid;
  gap: $space-4;
  grid-template-columns: minmax(0, 1fr);
}

.car-page__local-item {
  min-width: 0;
}

.car-page__term {
  color: $color-text-muted;
  font-size: 0.875rem;
}

.car-page__value {
  color: $color-text;
  font-size: 0.875rem;
  font-weight: 500;
  margin: $space-1 0 0;
}

@include up($bp-sm) {
  .car-page__local-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@include up($bp-md) {
  .car-page__hero {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .car-page__details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

