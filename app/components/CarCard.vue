<script setup lang="ts">
import type { Car } from '~/types/car'
import { buildCarSlug } from '../utils/carSlug'

interface Props {
  car: Car
}

const props = defineProps<Props>()
const carSlug = computed(() => buildCarSlug(props.car))

const imageUrl = computed(() => {
  const keywords = `${props.car.make} ${props.car.model} car`.replace(/\s+/g, ',')
  return `https://loremflickr.com/400/250/${keywords}?lock=${props.car.id}`
})
</script>

<template>
  <NuxtLink
    :to="`/car/${carSlug}`"
    class="car-card"
  >
    <div class="car-card__image-wrap">
      <img
        :src="imageUrl"
        :alt="`${car.make} ${car.model}`"
        class="car-card__image"
        loading="lazy"
      >
    </div>

    <div class="car-card__meta">
      <h3 class="car-card__title">
        {{ car.make }} {{ car.model }}
      </h3>
      <p class="car-card__year">{{ car.year }}</p>
    </div>

    <div class="car-card__tags">
      <span
        v-if="car.bodyType"
        class="car-card__tag"
      >
        {{ car.bodyType }}
      </span>
      <span
        v-if="car.fuelType"
        class="car-card__tag"
      >
        {{ car.fuelType }}
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.car-card {
  background-color: $color-surface;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  display: block;
  padding: $space-4;
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: $shadow-md;
  }

  &:hover .car-card__image {
    transform: scale(1.05);
  }

  &:focus-visible {
    @include focus-ring;
    border-radius: $radius-xl;
  }
}

.car-card__image-wrap {
  aspect-ratio: 16 / 9;
  background-color: #f3f4f6;
  border-radius: $radius-md;
  overflow: hidden;
  width: 100%;
}

.car-card__image {
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  width: 100%;
}

.car-card__meta {
  margin-top: $space-4;
}

.car-card__title {
  color: $color-text;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 $space-1;
}

.car-card__year {
  color: $color-text-muted;
  font-size: 0.875rem;
  margin: 0;
}

.car-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  margin-top: $space-3;
}

.car-card__tag {
  align-items: center;
  background-color: #f9fafb;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text-muted;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  padding: 6px $space-2;
}
</style>

