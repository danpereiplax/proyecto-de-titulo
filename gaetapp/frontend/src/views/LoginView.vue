<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="bg-white rounded-lg shadow-2xl p-8">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Sistema GAET
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Gestión, Administración y Ejecución de Tareas
          </p>
        </div>
        
        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu.email@infomaxis.cl"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu contraseña"
            >
          </div>
          
          <div v-if="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>
          
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </span>
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center text-xs text-gray-500">
          <p>Sistema desarrollado para Infomaxis</p>
          <p>v{{ $appVersion || '1.0.0' }}</p>
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
    
    const loading = ref(false)
    const errorMessage = ref('')
    
    const loginForm = reactive({
      email: '',
      password: ''
    })
    
    const handleLogin = async () => {
      if (!loginForm.email || !loginForm.password) {
        errorMessage.value = 'Por favor, completa todos los campos'
        return
      }
      
      loading.value = true
      errorMessage.value = ''
      
      try {
        const result = await userStore.login({
          email: loginForm.email,
          password: loginForm.password
        })
        
        if (result.success) {
          // Redirigir según el rol del usuario
          const role = userStore.userProfile
          
          switch (role) {
            case 'Administrador':
              router.push('/admin')
              break
            case 'Supervisor':
              router.push('/supervisor')
              break
            case 'Técnico':
              router.push('/technician')
              break
            default:
              router.push('/login')
          }
        } else {
          errorMessage.value = result.message || 'Error al iniciar sesión'
        }
      } catch (error) {
        console.error('Login error:', error)
        errorMessage.value = 'Error de conexión. Intenta nuevamente.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      loginForm,
      loading,
      errorMessage,
      handleLogin
    }
  }
}
</script>