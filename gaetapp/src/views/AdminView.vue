<script setup>
import { ref } from 'vue';

const nuevoUsuario = ref({
  rut: '',
  dv: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  emailPersonal: '',     // NUEVO
  email: '',             // Corporativo
  telefono: '',
  perfil: '',
  clave: ''
});

async function crearUsuario() {
  try {
    const res = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario.value),
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Usuario creado');
      Object.keys(nuevoUsuario.value).forEach(k => nuevoUsuario.value[k] = '');
    } else {
      alert(`❌ Error: ${data.error || 'No se pudo crear el usuario'}`);
    }
  } catch (err) {
    alert('❌ Error de red al intentar crear usuario');
    console.error(err);
  }
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
        <input v-model="nuevoUsuario.emailPersonal" type="email" placeholder="Correo personal" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.email" type="email" placeholder="Correo corporativo" class="border p-2 rounded" />
        <input v-model="nuevoUsuario.telefono" type="text" placeholder="Teléfono" class="border p-2 rounded" />
        <select v-model="nuevoUsuario.perfil" class="border p-2 rounded">
          <option disabled value="">Seleccione perfil</option>
          <option value="1">Administrador</option>
          <option value="2">Técnico</option>
          <option value="3">Supervisor</option>
        </select>
        <input v-model="nuevoUsuario.clave" type="password" placeholder="Clave" class="border p-2 rounded col-span-2" />
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Crear usuario
      </button>
    </form>
  </div>
</template>
