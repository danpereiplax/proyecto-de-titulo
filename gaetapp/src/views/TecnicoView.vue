<script setup>
import { useRouter } from 'vue-router';
import { limpiarSesion } from '@/stores/auth';

const router = useRouter();

const cerrarSesion = () => {
  limpiarSesion();
  router.push('/');
};
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Panel Técnico</h2>
    <p>Bienvenido al panel del técnico.</p>

    <button @click="cerrarSesion" class="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
      Cerrar sesión
    </button>
  </div>
</template>
