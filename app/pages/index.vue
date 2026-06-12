<script setup lang="ts">
const { data } = await useFetch('/api/time', { key: 'page-a-time' })
</script>

<template>
  <div class="page a">
    <h1>Page A</h1>
    <p class="time">{{ data?.time }}</p>
    <NuxtLink to="/b">Page B →</NuxtLink>
  </div>
</template>

<style scoped>
.page { font-family: system-ui, sans-serif; margin: 4rem auto; max-width: 32rem; padding: 0 1rem; }
.a { color: #1d4ed8; }
.time { font-size: 1.5rem; }
a { display: block; margin-top: 1.5rem; color: inherit; }
</style>
