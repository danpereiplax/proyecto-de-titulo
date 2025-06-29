<template>
  <div class="admin-container">
    <h1>Panel Administrador</h1>

    <!-- Gestión de usuarios -->
    <section>
      <h2>Usuarios</h2>
      <ListaUsuarios />
      <button @click="mostrarCrearUsuario = !mostrarCrearUsuario">
        Crear Usuario
      </button>
      <div v-if="mostrarCrearUsuario">
        <!-- Formulario crear usuario -->
        <input v-model="nuevoUsuario.nombre" placeholder="Nombre" />
        <input v-model="nuevoUsuario.email" placeholder="Email" />
        <select v-model="nuevoUsuario.perfil">
          <option>Supervisor</option>
          <option>Tecnico</option>
        </select>
        <button @click="crearUsuario">Guardar</button>
      </div>
    </section>

    <!-- Asignar tareas -->
    <section>
      <h2>Asignar Tarea</h2>
      <input v-model="tarea.cliente" placeholder="Cliente" />
      <input v-model="tarea.descripcion" placeholder="Descripción" />
      <input v-model="tarea.fecha" type="date" />
      <select v-model="tarea.tecnicoId">
        <option v-for="t in tecnicos" :key="t.id" :value="t.id">
          {{ t.nombre }}
        </option>
      </select>
      <button @click="asignarTarea">Asignar</button>
    </section>

    <!-- Registrar local/cliente -->
    <section>
      <h2>Registrar Local/Cliente</h2>
      <input v-model="local.nombre" placeholder="Nombre Local" />
      <input v-model="local.direccion" placeholder="Dirección" />
      <button @click="registrarLocal">Registrar</button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListaUsuarios from './ListaUsuarios.vue'
import tareaService from '../services/tareaService'
import userService from '../services/userService'

const mostrarCrearUsuario = ref(false)
const nuevoUsuario = ref({
  nombre: '',
  email: '',
  perfil: 'Supervisor'
})

const tarea = ref({
  cliente: '',
  descripcion: '',
  fecha: '',
  tecnicoId: null
})

const local = ref({
  nombre: '',
  direccion: ''
})

const tecnicos = ref([])

onMounted(async () => {
  tecnicos.value = await userService.obtenerTecnicos()
})

async function crearUsuario() {
  await userService.crearUsuario(nuevoUsuario.value)
  alert('Usuario creado')
  mostrarCrearUsuario.value = false
}

async function asignarTarea() {
  await tareaService.asignarTarea(tarea.value)
  alert('Tarea asignada')
}

async function registrarLocal() {
  await tareaService.registrarLocal(local.value)
  alert('Local registrado')
}
</script>

<style scoped>
.admin-container {
  padding: 2rem;
}
section {
  margin-bottom: 2rem;
}
</style>
