<!-- frontend/src/components/supervisor/clients/ClientDetailModal.vue -->
<template>
  <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" @click="closeOnBackdrop">
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto" @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-medium text-gray-900">{{ client.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">RUT: {{ client.rut }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="$emit('create-task', client)" 
            class="px-3 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <i class="mr-2 fas fa-plus"></i>Nueva Tarea
          </button>
          <button 
            @click="$emit('edit', client)" 
            class="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <i class="mr-2 fas fa-edit"></i>Editar
          </button>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <i class="text-xl fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="space-y-6 lg:col-span-2">
          
          <!-- Contact Information -->
          <div class="p-6 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Información de Contacto</h4>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div v-if="client.contactPerson">
                <label class="text-sm font-medium text-gray-500">Persona de Contacto</label>
                <p class="text-sm text-gray-900">{{ client.contactPerson }}</p>
              </div>
              <div v-if="client.email">
                <label class="text-sm font-medium text-gray-500">Email</label>
                <p class="text-sm text-gray-900">
                  <a :href="`mailto:${client.email}`" class="text-blue-600 hover:underline">
                    {{ client.email }}
                  </a>
                </p>
              </div>
              <div v-if="client.phone">
                <label class="text-sm font-medium text-gray-500">Teléfono</label>
                <p class="text-sm text-gray-900">
                  <a :href="`tel:${client.phone}`" class="text-blue-600 hover:underline">
                    {{ client.phone }}
                  </a>
                </p>
              </div>
              <div v-if="client.address">
                <label class="text-sm font-medium text-gray-500">Dirección</label>
                <p class="text-sm text-gray-900">{{ client.address }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="client.notes" class="p-6 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Notas</h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ client.notes }}</p>
          </div>

          <!-- Recent Activity -->
          <div class="p-6 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Actividad Reciente</h4>
            <div class="py-8 text-center text-gray-500">
              <i class="mb-2 text-2xl fas fa-clock"></i>
              <p>Funcionalidad próximamente</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          
          <!-- Stats -->
          <div class="p-6 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Estadísticas</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Ubicaciones</span>
                <span class="text-sm font-medium text-gray-900">{{ client.locations }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Tareas Activas</span>
                <span class="text-sm font-medium text-gray-900">{{ client.activeTasks }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Total Tareas</span>
                <span class="text-sm font-medium text-gray-900">{{ client.totalTasks || client.activeTasks }}</span>
              </div>
              <div v-if="client.createdAt" class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Cliente desde</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(client.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="p-6 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Acciones Rápidas</h4>
            <div class="space-y-2">
              <button 
                @click="$emit('create-task', client)"
                class="w-full px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-50"
              >
                <i class="mr-2 text-green-500 fas fa-plus"></i>
                Crear Nueva Tarea
              </button>
              <button 
                class="w-full px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-50"
              >
                <i class="mr-2 text-blue-500 fas fa-map-marker-alt"></i>
                Ver Ubicaciones
              </button>
              <button 
                class="w-full px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-50"
              >
                <i class="mr-2 text-purple-500 fas fa-chart-bar"></i>
                Ver Reportes
              </button>
              <button 
                class="w-full px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-50"
              >
                <i class="mr-2 text-yellow-500 fas fa-envelope"></i>
                Enviar Email
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientDetailModal',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'edit', 'create-task'],
  methods: {
    closeOnBackdrop(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close')
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('es-CL')
    }
  }
}
</script>