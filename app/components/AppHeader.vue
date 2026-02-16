<template>
  <header class="site-header">
    <div class="site-header__container">
      <div class="site-header__row">
        <NuxtLink to="/" class="site-header__brand">
          Car Catalog
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.site-header {
  background-color: $color-surface;
  box-shadow: $shadow-sm;
}

.site-header__container {
  @include page-container;
  padding-bottom: $space-4;
  padding-top: $space-4;
}

.site-header__row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.site-header__brand {
  color: $color-text;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-secondary;
  }

  &:focus-visible {
    @include focus-ring;
    border-radius: $radius-sm;
  }
}
</style>

