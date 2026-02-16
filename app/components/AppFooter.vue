<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__container">
      <div class="site-footer__row">
        <p class="site-footer__copyright">
          &copy; {{ currentYear }} Car Catalog
        </p>

        <a
          href="#"
          class="site-footer__github-link"
          aria-label="GitHub repository (placeholder)"
          title="GitHub repository (placeholder)"
        >
          <svg
            class="site-footer__github-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56l-.01-2.18c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.72 0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.5.11-3.14 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.64.23 2.84.11 3.14.75.82 1.2 1.85 1.2 3.11 0 4.45-2.7 5.43-5.28 5.71.42.36.8 1.08.8 2.19l-.01 3.24c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"
            />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;
@use '~/assets/styles/mixins' as *;

.site-footer {
  background-color: $color-surface;
  border-top: 1px solid $color-border;
  margin-top: $space-8;
}

.site-footer__container {
  @include page-container;
  padding-bottom: $space-6;
  padding-top: $space-6;
}

.site-footer__row {
  align-items: center;
  display: flex;
  gap: $space-4;
  justify-content: center;
}

.site-footer__copyright {
  color: $color-text-muted;
  font-size: 0.9375rem;
  margin: 0;
}

.site-footer__github-link {
  align-items: center;
  border: 1px solid $color-border;
  border-radius: 999px;
  color: $color-text-secondary;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
  width: 36px;

  &:hover {
    background-color: $color-bg;
    border-color: $color-border-soft;
    color: $color-text;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.site-footer__github-icon {
  height: 18px;
  width: 18px;
}
</style>
