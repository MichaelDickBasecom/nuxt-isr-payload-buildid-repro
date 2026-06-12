export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  experimental: {
    // Markiz9999 repro: split payload → HTML/payload cache desync on document load
    payloadExtraction: true,
  },

  routeRules: {
    '/': { swr: 60 },
    '/b': { swr: 60 },
  },
})
