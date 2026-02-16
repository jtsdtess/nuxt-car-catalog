<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/tokens' as *;

.app-shell {
  background-color: $color-bg;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>

