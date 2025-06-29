<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      <h1 class="text-xl font-semibold">GAET App</h1>
    </div>

    <nav class="space-x-4">
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      <RouterLink to="/about" class="hover:underline">About</RouterLink>
      <RouterLink to="/admin" class="hover:underline">Admin</RouterLink>
      <RouterLink to="/tecnico" class="hover:underline">Técnico</RouterLink>
      <RouterLink to="/supervisor" class="hover:underline">Supervisor</RouterLink>
    </nav>
  </header>

  <main class="p-6">
    <RouterView />
  </main>
</template>

<style scoped>
.logo {
  display: block;
}
</style>
