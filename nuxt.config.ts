export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  experimental: {
    payloadExtraction: 'client',
  },

  routeRules: {
    '/': { isr: 120 },
    '/b': { isr: 120 },
  },
})
