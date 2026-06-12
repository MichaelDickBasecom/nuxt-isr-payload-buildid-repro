<script setup lang="ts">
const { data } = await useFetch('/api/time', { key: 'page-b-time' })
</script>

<template>
  <div class="page b">
    <h1>Page B</h1>
    <p class="time">{{ data?.time }}</p>
    <NuxtLink to="/">← Page A</NuxtLink>
  </div>
</template>

<style scoped>
.page { font-family: system-ui, sans-serif; margin: 4rem auto; max-width: 32rem; padding: 0 1rem; }
.b { color: #b91c1c; }
.time { font-size: 1.5rem; }
a { display: block; margin-top: 1.5rem; color: inherit; }
</style>
