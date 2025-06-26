<script setup>
import { ref } from 'vue';

const nuevoUsuario = ref({
  rut: '',
  dv: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  email: '',
  telefono: '',
  perfil: '',
  clave: ''
});

function crearUsuario() {
  // Aquí iría la lógica real de conexión con backend (POST a /api/persona o similar)
  console.log('Usuario a crear:', nuevoUsuario.value);
  alert('Usuario creado (simulado)');
  Object.keys(nuevoUsuario.value).forEach(key => nuevoUsuario.value[key] = '');
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
    <h2 class="text-2xl font-bold mb-6">Crear nuevo usuario</h2>
    <form @submit.prevent="crearUsuario" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="nuevoUsuario.rut" type="text" placeholder="RUT" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.dv" type="text" placeholder="Digito Verificador" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.nombre" type="text" placeholder="Nombre" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.apellidoPaterno" type="text" placeholder="Apellido paterno" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.apellidoMaterno" type="text" placeholder="Apellido materno" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.email" type="email" placeholder="Correo" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.telefono" type="text" placeholder="Teléfono" class="border p-2 rounded" />
        <select v-model="nuevoUsuario.perfil" class="border p-2 rounded">
          <option disabled value="">Seleccione perfil</option>
          <option value="admin">Administrador</option>
          <option value="tecnico">Técnico</option>
          <option value="supervisor">Supervisor</option>
        </select>
        <input v-model="nuevoUsuario.clave" type="password" placeholder="Clave" class="border p-2 rounded col-span-2" />
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Crear usuario
      </button>
    </form>
  </div>
</template>
