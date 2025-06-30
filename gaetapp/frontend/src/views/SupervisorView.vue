<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();

const logout = () => {
  limpiarSesion() // QUITAR
  userStore.logout() // AGREGAR
  router.push('/login')
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Panel Supervisor</h2>
    <p>Bienvenido al panel del supervisor.</p>

    <button @click="cerrarSesion" class="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
      Cerrar sesión
    </button>
  </div>
</template>
