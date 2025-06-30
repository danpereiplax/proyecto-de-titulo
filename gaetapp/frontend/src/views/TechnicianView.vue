<!-- frontend/src/views/TechnicianView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">GAET - Técnico</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Bienvenido, {{ userName }}</span>
            <button @click="logout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Vista de Técnico</h2>
          <p class="text-gray-600">Esta vista está en desarrollo. Pronto tendrás acceso a:</p>
          
          <ul class="mt-4 list-disc list-inside space-y-2 text-gray-600">
            <li>Ver tareas asignadas</li>
            <li>Actualizar estado de tareas</li>
            <li>Subir evidencia fotográfica</li>
            <li>Registrar tiempo de ejecución</li>
            <li>Completar tareas</li>
          </ul>
          
          <div class="mt-6 p-4 bg-blue-50 rounded-md">
            <p class="text-blue-800">🚧 En construcción - Próximamente disponible</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'TechnicianView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const userName = computed(() => userStore.userName)
    
    const logout = () => {
      userStore.logout()
      router.push('/login')
    }
    
    return {
      userName,
      logout
    }
  }
}
</script>