<template>
  <div class="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-center">Crear Nuevo Usuario</h2>

    <form @submit.prevent="crearUsuario" class="space-y-4">
      <input v-model="usuario.rut" type="text" placeholder="RUT" class="w-full border p-2 rounded" />
      <input v-model="usuario.nombre" type="text" placeholder="Nombre" class="w-full border p-2 rounded" />
      <input v-model="usuario.apellidoPaterno" type="text" placeholder="Apellido Paterno" class="w-full border p-2 rounded" />
      <input v-model="usuario.apellidoMaterno" type="text" placeholder="Apellido Materno" class="w-full border p-2 rounded" />
      <input v-model="usuario.correo" type="email" placeholder="Correo Corporativo" class="w-full border p-2 rounded" />

      <select v-model="usuario.perfil" class="w-full border p-2 rounded">
        <option disabled value="">Seleccione un perfil</option>
        <option value="admin">Administrador</option>
        <option value="tecnico">Técnico</option>
        <option value="supervisor">Supervisor</option>
      </select>

      <input v-model="usuario.clave" type="password" placeholder="Clave" class="w-full border p-2 rounded" />

      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Registrar Usuario
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const usuario = ref({
  rut: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo: '',
  perfil: '',
  clave: '',
});

const crearUsuario = () => {
  console.log('Usuario a registrar:', usuario.value);
  alert('Usuario registrado (simulado)');
  // Aquí irá luego la llamada real al backend con fetch o axios
};
</script>
