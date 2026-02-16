<script setup lang="ts">
import type { CarDetails } from '~/types/car'

interface Props {
  apiData: Omit<CarDetails, 'id' | 'make' | 'model' | 'year'>
  apiLoading: boolean
  apiError: string | undefined
  isApiEmpty: boolean
  carId: number
}

defineProps<Props>()

interface Emits {
  (e: 'retry'): void
}

const emit = defineEmits<Emits>()

function onRetry() {
  emit('retry')
}
</script>

<template>
  <div class="api-details">
    <div class="api-details__header">
      <h2 class="api-details__title">Данные из CarQuery API</h2>
      <InfoTooltip
        text="Данные загружаются через серверный эндпоинт /api/carquery/:make/:model/:year и проксируются из CarQuery API."
        label="Источник данных CarQuery API"
      />
    </div>

    <!-- API Loading -->
    <div v-if="apiLoading" class="api-details__loading">
      <LoadingSpinner size="md" />
      <span class="api-details__loading-text">Loading from CarQuery API...</span>
    </div>

    <!-- API Error -->
    <div v-else-if="apiError" class="api-details__error">
      <div class="api-details__error-row">
        <svg
          class="api-details__error-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="api-details__error-content">
          <h3 class="api-details__error-title">API Error</h3>
          <p class="api-details__error-text">{{ apiError }}</p>
          <button
            class="api-details__retry-button"
            @click="onRetry"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- API Data -->
    <div v-else-if="apiData" class="api-details__content">
      <!-- Specifications -->
      <div class="api-details__grid api-details__grid--three-cols">
        <div v-if="apiData.engine" class="api-details__item">
          <dt class="api-details__term">Engine</dt>
          <dd class="api-details__value">{{ apiData.engine }}</dd>
        </div>
        <div v-if="apiData.transmission" class="api-details__item">
          <dt class="api-details__term">Transmission</dt>
          <dd class="api-details__value">{{ apiData.transmission }}</dd>
        </div>
        <div v-if="apiData.drive" class="api-details__item">
          <dt class="api-details__term">Drive Type</dt>
          <dd class="api-details__value">{{ apiData.drive }}</dd>
        </div>
        <div v-if="apiData.doors" class="api-details__item">
          <dt class="api-details__term">Doors</dt>
          <dd class="api-details__value">{{ apiData.doors }}</dd>
        </div>
        <div v-if="apiData.seats" class="api-details__item">
          <dt class="api-details__term">Seats</dt>
          <dd class="api-details__value">{{ apiData.seats }}</dd>
        </div>
      </div>

      <!-- Fuel Economy -->
      <div v-if="apiData.fuelEconomy" class="api-details__grid api-details__grid--three-cols">
        <div v-if="apiData.fuelEconomy.city" class="api-details__item">
          <dt class="api-details__term">City MPG</dt>
          <dd class="api-details__value">{{ apiData.fuelEconomy.city }}</dd>
        </div>
        <div v-if="apiData.fuelEconomy.highway" class="api-details__item">
          <dt class="api-details__term">Highway MPG</dt>
          <dd class="api-details__value">{{ apiData.fuelEconomy.highway }}</dd>
        </div>
        <div v-if="apiData.fuelEconomy.combined" class="api-details__item">
          <dt class="api-details__term">Combined MPG</dt>
          <dd class="api-details__value">{{ apiData.fuelEconomy.combined }}</dd>
        </div>
      </div>

      <!-- Pricing -->
      <div v-if="apiData.price" class="api-details__grid api-details__grid--two-cols">
        <div v-if="apiData.price.msrp" class="api-details__item">
          <dt class="api-details__term">MSRP</dt>
          <dd class="api-details__value">${{ apiData.price.msrp.toLocaleString() }}</dd>
        </div>
        <div v-if="apiData.price.invoice" class="api-details__item">
          <dt class="api-details__term">Invoice Price</dt>
          <dd class="api-details__value">${{ apiData.price.invoice.toLocaleString() }}</dd>
        </div>
      </div>

      <!-- Trims -->
      <div v-if="apiData.trims && apiData.trims.length > 0" class="api-details__trims">
        <h3 class="api-details__trims-title">
          Available Trims ({{ apiData.trims.length }})
        </h3>
        <table class="api-details__table">
          <thead>
            <tr>
              <th class="api-details__th">
                Trim
              </th>
              <th class="api-details__th">
                Body
              </th>
              <th class="api-details__th">
                Engine
              </th>
              <th class="api-details__th api-details__th--right">
                MSRP
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trim in apiData.trims" :key="trim.id" class="api-details__table-row">
              <td class="api-details__td api-details__td--strong api-details__td--nowrap">
                {{ trim.trimName }}
              </td>
              <td class="api-details__td api-details__td--nowrap">
                {{ trim.bodyTypeName }}
              </td>
              <td class="api-details__td">{{ trim.engineName }}</td>
              <td class="api-details__td api-details__td--strong api-details__td--nowrap api-details__td--right">
                {{ trim.msrp ? `$${trim.msrp.toLocaleString()}` : 'N/A' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No API data yet -->
    <div v-else-if="isApiEmpty" class="api-details__empty">
      <div class="api-details__empty-row">
        <svg
          class="api-details__empty-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414A1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <div class="api-details__empty-content">
          <h3 class="api-details__empty-title">No Data Available</h3>
          <p class="api-details__empty-text">
            CarQuery API has no information for this vehicle.
          </p>
        </div>
      </div>
    </div>

    <!-- Not loaded yet -->
    <div v-else class="api-details__placeholder">
      <p class="api-details__placeholder-text">Loading data from CarQuery API...</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.api-details {
  background-color: $color-primary-soft;
  border: 1px solid $color-primary-border;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  padding: $space-6;
}

.api-details__header {
  align-items: center;
  display: flex;
  gap: $space-2;
  margin-bottom: $space-4;
}

.api-details__title {
  color: $color-text;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.api-details__loading {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: $space-8 0;
}

.api-details__loading-text {
  color: $color-text-secondary;
  font-size: 0.875rem;
  margin-left: $space-3;
}

.api-details__error {
  background-color: $color-danger-soft;
  border: 1px solid $color-danger-border;
  border-radius: $radius-md;
  padding: $space-4;
}

.api-details__error-row {
  align-items: flex-start;
  display: flex;
}

.api-details__error-icon {
  color: #f87171;
  flex-shrink: 0;
  height: 20px;
  width: 20px;
}

.api-details__error-content {
  margin-left: $space-3;
}

.api-details__error-title {
  color: #991b1b;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.api-details__error-text {
  color: #b91c1c;
  font-size: 0.875rem;
  margin: $space-1 0 0;
}

.api-details__retry-button {
  background: none;
  border: none;
  color: #991b1b;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: $space-2;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #7f1d1d;
  }

  &:focus-visible {
    @include focus-ring(rgba($color-danger, 0.25));
    border-radius: $radius-sm;
  }
}

.api-details__content {
  display: grid;
  gap: $space-6;
}

.api-details__grid {
  display: grid;
  gap: $space-4;
  grid-template-columns: minmax(0, 1fr);
}

.api-details__grid--two-cols {
  @include up($bp-sm) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.api-details__grid--three-cols {
  @include up($bp-sm) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.api-details__item {
  min-width: 0;
}

.api-details__term {
  color: $color-text-muted;
  font-size: 0.875rem;
  margin: 0;
}

.api-details__value {
  color: $color-text;
  font-size: 0.875rem;
  font-weight: 500;
  margin: $space-1 0 0;
}

.api-details__trims {
  overflow-x: auto;
}

.api-details__trims-title {
  color: $color-text-secondary;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 $space-2;
}

.api-details__table {
  border-collapse: collapse;
  min-width: 100%;
}

.api-details__th {
  border-bottom: 1px solid $color-border;
  color: $color-text-muted;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  padding: $space-2 $space-3;
  text-align: left;
  text-transform: uppercase;
}

.api-details__th--right {
  text-align: right;
}

.api-details__table-row {
  &:hover {
    background-color: #dbeafe;
  }
}

.api-details__td {
  border-bottom: 1px solid $color-border;
  color: $color-text-secondary;
  font-size: 0.875rem;
  padding: $space-2 $space-3;
}

.api-details__td--strong {
  color: $color-text;
  font-weight: 500;
}

.api-details__td--nowrap {
  white-space: nowrap;
}

.api-details__td--right {
  text-align: right;
}

.api-details__empty,
.api-details__placeholder {
  background-color: #f9fafb;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-4;
}

.api-details__empty-row {
  align-items: flex-start;
  display: flex;
}

.api-details__empty-icon {
  color: #9ca3af;
  flex-shrink: 0;
  height: 20px;
  width: 20px;
}

.api-details__empty-content {
  margin-left: $space-3;
}

.api-details__empty-title {
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.api-details__empty-text {
  color: $color-text-secondary;
  font-size: 0.875rem;
  margin: $space-1 0 0;
}

.api-details__placeholder-text {
  color: $color-text-muted;
  font-size: 0.875rem;
  font-style: italic;
  margin: 0;
}
</style>

