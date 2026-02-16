// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint', 'pinia-plugin-persistedstate'],

  css: ['~/assets/styles/main.scss'],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/car-filled.svg?v=2' },
        { rel: 'shortcut icon', href: '/car-filled.svg?v=2' },
      ],
    },
  },

  ssr: true,

  typescript: {
    strict: true,
    typeCheck: false,
  },

  pinia: {
    storesDirs: ['./stores/**', './app/stores/**'],
  },
})

