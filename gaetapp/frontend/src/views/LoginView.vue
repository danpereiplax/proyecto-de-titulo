<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <i class="fas fa-tasks text-blue-600 text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistema GAET - Gestión de Tareas
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Nombre de usuario</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nombre de usuario"
              :disabled="loading"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-spinner fa-spin text-blue-500"></i>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-lock text-blue-500"></i>
            </span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          GAET v1.0.0 - Infomaxis
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const form = ref({
      username: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      if (!form.value.username || !form.value.password) {
        error.value = 'Por favor, completa todos los campos'
        return
      }

      loading.value = true
      error.value = ''

      try {
        console.log('🔄 Intentando login con:', { username: form.value.username })
        
        const result = await userStore.login({
          username: form.value.username,
          password: form.value.password
        })

        console.log('✅ Login exitoso:', result)

        // Debug: Mostrar toda la respuesta del usuario
        console.log('🔍 Datos completos del usuario:', result.user)

        // Redirigir según el rol del usuario (buscar en perfil o descripcion_perfil_usuario)
        const role = result.user.perfil || result.user.descripcion_perfil_usuario
        console.log('👤 Rol detectado:', role)

        switch (role) {
          case 'ADMINISTRADOR':
            console.log('🔄 Redirigiendo a /administrador')
            await router.push('/administrador')
            break
          case 'SUPERVISOR':
            console.log('🔄 Redirigiendo a /supervisor')
            await router.push('/supervisor')
            break
          case 'TECNICO':
            console.log('🔄 Redirigiendo a /tecnico')
            await router.push('/tecnico')
            break
          default:
            console.log('🔄 Rol desconocido:', role, 'redirigiendo a /administrador')
            await router.push('/administrador')
        }

      } catch (err) {
        console.error('❌ Error en login:', err)
        error.value = err.message || 'Error al iniciar sesión'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>