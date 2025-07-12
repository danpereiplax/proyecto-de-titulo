<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="bg-white rounded-lg shadow-2xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-tasks text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">GAET</h2>
          <p class="mt-2 text-sm text-gray-600">Gestión, Administración y Ejecución de Tareas</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Corporativo
            </label>
            <div class="mt-1 relative">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                :disabled="loading"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="usuario@infomaxis.cl"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="loading"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </span>
              <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-sign-in-alt text-blue-300 group-hover:text-blue-200"></i>
              </span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">
            GAET v1.0.0 - Sistema de Gestión de Tareas
          </p>
          <p class="text-xs text-gray-400 mt-1">
            © 2025 Infomaxis SPA
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    
    // Form data
    const form = reactive({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      if (!form.email || !form.password) {
        error.value = 'Por favor completa todos los campos'
        return
      }

      try {
        loading.value = true
        error.value = ''
        
        console.log('🔐 Intentando login con:', { email: form.email })
        
        const result = await userStore.login({
          email: form.email,
          password: form.password
        })

        if (result.success) {
          // Redirigir según el rol del usuario
          const role = userStore.userProfile
          
          console.log('✅ Login exitoso, rol:', role)
          
          switch (role) {
            case 'ADMINISTRADOR':
              console.log('📊 Redirigiendo a panel de administrador')
              router.push('/administrador')
              break
            case 'SUPERVISOR':
              console.log('👨‍💼 Redirigiendo a panel de supervisor')
              router.push('/supervisor')
              break
            case 'TECNICO':
              console.log('🔧 Redirigiendo a panel de técnico')
              router.push('/tecnico')
              break
            case 'RRHH':
              console.log('👥 Redirigiendo a panel de RRHH')
              router.push('/rrhh')
              break
            default:
              console.warn('⚠️ Rol no reconocido:', role)
              error.value = 'Rol de usuario no válido'
          }
        } else {
          error.value = result.message || 'Error al iniciar sesión'
        }
      } catch (err) {
        console.error('❌ Error en login:', err)
        error.value = err.response?.data?.message || 'Error de conexión. Verifica tus credenciales.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      showPassword,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.5s ease-out;
}

/* Efectos hover mejorados */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

/* Responsive */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 90%;
  }
}
</style>