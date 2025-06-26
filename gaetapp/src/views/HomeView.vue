<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { setPerfil } from '@/stores/auth';
import { limpiarSesion } from '@/stores/auth';

const rut = ref('');
const clave = ref('');
const router = useRouter();

// Simulación de login con perfil
function iniciarSesion() {
  if (rut.value === '12345678' && clave.value === 'admin') {
    setPerfil('admin');
    router.push('/admin');
  } else if (rut.value === '23456789' && clave.value === 'tecnico') {
    setPerfil('tecnico');
    router.push('/tecnico');
  } else if (rut.value === '34567890' && clave.value === 'supervisor') {
    setPerfil('supervisor');
    router.push('/supervisor');
  } else {
    alert('Credenciales inválidas');
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-20 p-4 border rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-center">Inicio de Sesión</h2>
    <input v-model="rut" type="text" placeholder="RUT" class="w-full mb-2 border p-2 rounded" />
    <input v-model="clave" type="password" placeholder="Clave" class="w-full mb-4 border p-2 rounded" />
    <button @click="iniciarSesion" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
      Ingresar
    </button>
  </div>
</template>
