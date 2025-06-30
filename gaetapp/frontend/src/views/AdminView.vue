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
      <div v-if="mostrarCrearUsuario" class="mt-2">
        <!-- Formulario crear usuario -->
        <input v-model="nuevoUsuario.nombre" placeholder="Nombre" class="input-field" />
        <input v-model="nuevoUsuario.email" placeholder="Email" class="input-field" />
        <select v-model="nuevoUsuario.perfil" class="input-field">
          <option>Supervisor</option>
          <option>Tecnico</option>
        </select>
        <button @click="crearNuevoUsuario" class="btn-save">Guardar</button>
      </div>
    </section>

    <!-- Asignar tareas -->
    <section>
      <h2>Asignar Tarea</h2>
      <input v-model="tarea.cliente" placeholder="Cliente" class="input-field" />
      <input v-model="tarea.descripcion" placeholder="Descripción" class="input-field" />
      <input v-model="tarea.fecha" type="date" class="input-field" />
      <select v-model="tarea.tecnicoId" class="input-field">
        <option v-for="t in tecnicos" :key="t.id" :value="t.id">
          {{ t.nombre }}
        </option>
      </select>
      <button @click="asignarTarea" class="btn-save">Asignar</button>
    </section>

    <!-- Registrar local/cliente -->
    <section>
      <h2>Registrar Local/Cliente</h2>
      <input v-model="local.nombre" placeholder="Nombre Local" class="input-field" />
      <input v-model="local.direccion" placeholder="Dirección" class="input-field" />
      <button @click="handleRegistrarLocal" class="btn-save">Registrar</button>
    </section>

    <!-- Botón cerrar sesión -->
    <button @click="logout" class="btn-logout">
      Cerrar Sesión
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ListaUsuarios from './ListaUsuarios.vue'
import { limpiarSesion } from '../stores/auth'

// ✅ Importa la función del servicio SIN conflicto
import { crearTarea } from '../services/tareaService'
import { obtenerTecnicos, crearUsuario } from '../services/userService'

const router = useRouter()

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
  tecnicos.value = await obtenerTecnicos()
})

async function crearNuevoUsuario() {
  await crearUsuario(nuevoUsuario.value)
  alert('Usuario creado')
  mostrarCrearUsuario.value = false
}

async function asignarTarea() {
  await crearTarea(tarea.value)
  alert('Tarea asignada')
}

// ✅ Ahora NO hay duplicado: función local llama a la del servicio
async function handleRegistrarLocal() {
  await registrarLocalAPI(local.value)
  alert('Local registrado')
}

function logout() {
  limpiarSesion()
  router.push('/') // Redirige al login
}
</script>

<style scoped>
.admin-container {
  padding: 2rem;
}

section {
  margin-bottom: 2rem;
}

.input-field {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-save {
  background-color: #2563eb; /* Azul Tailwind */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.btn-save:hover {
  background-color: #1d4ed8;
}

.btn-logout {
  background-color: #dc2626; /* Rojo Tailwind */
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  margin-top: 2rem;
}

.btn-logout:hover {
  background-color: #b91c1c;
}
</style>
