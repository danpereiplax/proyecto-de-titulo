<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

// Detecta la ruta actual
const route = useRoute()

// Muestra el header solo si NO estás en el login
const showHeader = computed(() => route.path !== '/')
</script>

<template>
  <!-- Navbar -->
  <header
    v-if="showHeader"
    class="bg-gray-800 text-white p-4 flex justify-between items-center"
  >
    <div class="flex items-center space-x-4">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      <h1 class="text-xl font-semibold">GAET App</h1>
    </div>

    <nav class="space-x-4">
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      <RouterLink to="/admin" class="hover:underline">Admin</RouterLink>
      <RouterLink to="/tecnico" class="hover:underline">Técnico</RouterLink>
      <RouterLink to="/supervisor" class="hover:underline">Supervisor</RouterLink>
    </nav>
  </header>

  <!-- Contenido de la vista -->
  <RouterView />
</template>

<style scoped>
.logo {
  display: block;
}
</style>
