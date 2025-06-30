<template>
  <!-- Este div llena toda la pantalla con gradiente -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
    <!-- Este div es la tarjeta -->
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-800">Iniciar Sesión</h1>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-1 font-semibold">Usuario</label>
          <input
            v-model="usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1 font-semibold">Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors font-semibold"
        >
          Entrar
        </button>
      </form>

      <p v-if="error" class="text-red-600 mt-4 text-center font-medium">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setPerfil, setToken } from '../stores/auth'

const router = useRouter()
const usuario = ref('')
const password = ref('')
const error = ref('')

function login() {
  if (usuario.value === 'admin' && password.value === '1234') {
    setPerfil('SUPERVISOR')
    setToken('token_prueba')
    router.push('/admin')
  } else {
    error.value = 'Credenciales inválidas'
  }
}
</script>
