<script setup>
import { ref, onMounted } from 'vue';

const usuarios = ref([]);
const cargando = ref(true);

async function obtenerUsuarios() {
  cargando.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/usuarios');
    const data = await res.json();
    usuarios.value = data;
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
  } finally {
    cargando.value = false;
  }
}

async function eliminarUsuario(rut) {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/usuarios/${rut}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    alert(data.message || 'Usuario eliminado');
    await obtenerUsuarios();
  } catch (err) {
    alert('Error al eliminar usuario');
    console.error(err);
  }
}

onMounted(obtenerUsuarios);
</script>

<template>
  <div class="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Lista de Usuarios</h2>
    
    <div v-if="cargando">Cargando usuarios...</div>
    <table v-else class="w-full table-auto border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">RUT</th>
          <th class="p-2 border">Nombre</th>
          <th class="p-2 border">Correo</th>
          <th class="p-2 border">Teléfono</th>
          <th class="p-2 border">Perfil</th>
          <th class="p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.rut_persona">
          <td class="p-2 border">{{ usuario.rut_persona }}-{{ usuario.rut_dv_persona }}</td>
          <td class="p-2 border">{{ usuario.nombre_persona }} {{ usuario.apellido_paterno_persona }}</td>
          <td class="p-2 border">{{ usuario.email_corporativo }}</td>
          <td class="p-2 border">{{ usuario.telefono }}</td>
          <td class="p-2 border">{{ usuario.id_perfil_usuario }}</td>
          <td class="p-2 border">
            <button @click="eliminarUsuario(usuario.rut_persona)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
