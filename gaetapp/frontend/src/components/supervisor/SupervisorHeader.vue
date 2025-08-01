<!-- frontend/src/components/supervisor/SupervisorHeader.vue -->
<template>
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">Panel de Supervisión</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-700">
            <span class="font-medium">{{ userName }}</span>
            <span class="ml-2 text-gray-500">({{ userRole }})</span>
          </div>
          <button @click="$emit('logout')" class="px-3 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700">
            <i class="mr-2 fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SupervisorHeader',
  props: {
    userName: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true
    }
  },
  emits: ['logout']
}
</script>

