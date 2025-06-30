<!-- frontend/src/views/NotFoundView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        <p class="text-gray-500 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        
        <div class="space-y-4">
          <button
            @click="goBack"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Volver Atrás
          </button>
          
          <button
            @click="goHome"
            class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'NotFoundView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const goBack = () => {
      router.go(-1)
    }
    
    const goHome = () => {
      if (userStore.isAuthenticated) {
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
        router.push('/login')
      }
    }
    
    return {
      goBack,
      goHome
    }
  }
}
</script>