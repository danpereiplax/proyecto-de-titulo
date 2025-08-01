<!-- frontend/src/components/supervisor/tasks/TaskDetailModal.vue -->
<template>
  <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" @click="closeOnBackdrop">
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto" @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-medium text-gray-900">{{ task.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">Tarea #{{ task.id }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="$emit('edit', task)" class="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
            <i class="mr-2 fas fa-edit"></i>Editar
          </button>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <i class="text-xl fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Task Content -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="space-y-6 lg:col-span-2">
          
          <!-- Status and Priority -->
          <div class="p-4 rounded-lg bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span :class="getTaskStatusClass(task.status)" class="px-3 py-1 text-sm font-semibold rounded-full">
                  {{ getStatusLabel(task.status) }}
                </span>
                <span :class="getPriorityClass(task.priority)" class="px-3 py-1 text-sm font-medium rounded">
                  Prioridad: {{ task.priority }}
                </span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="task.description">
            <h4 class="mb-2 text-lg font-medium text-gray-900">Descripción</h4>
            <div class="p-4 bg-white border rounded-lg">
              <p class="text-gray-700 whitespace-pre-wrap">{{ task.description }}</p>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="task.notes">
            <h4 class="mb-2 text-lg font-medium text-gray-900">Observaciones</h4>
            <div class="p-4 bg-white border rounded-lg">
              <p class="text-gray-700 whitespace-pre-wrap">{{ task.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          
          <!-- Assignment Info -->
          <div class="p-4 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Asignación</h4>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Técnico</label>
                <p class="text-sm text-gray-900">{{ task.technician || 'Sin asignar' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Cliente</label>
                <p class="text-sm text-gray-900">{{ task.client }}</p>
              </div>
              <div v-if="task.location">
                <label class="text-sm font-medium text-gray-500">Ubicación</label>
                <p class="text-sm text-gray-900">{{ task.location }}</p>
              </div>
            </div>
          </div>

          <!-- Schedule Info -->
          <div class="p-4 bg-white border rounded-lg">
            <h4 class="mb-4 text-lg font-medium text-gray-900">Programación</h4>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Fecha Programada</label>
                <p class="text-sm text-gray-900">{{ formatDate(task.date) }}</p>
              </div>
              <div v-if="task.dueDate">
                <label class="text-sm font-medium text-gray-500">Fecha Límite</label>
                <p class="text-sm text-gray-900">{{ formatDate(task.dueDate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskDetailModal',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'edit'],
  methods: {
    closeOnBackdrop(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close')
      }
    },
    getTaskStatusClass(status) {
      switch (status) {
        case 'ASIGNADA':
          return 'bg-blue-100 text-blue-800'
        case 'ENEJECUCION':
          return 'bg-yellow-100 text-yellow-800'
        case 'FINALIZADA':
          return 'bg-green-100 text-green-800'
        case 'CANCELADA':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    getStatusLabel(status) {
      const labels = {
        'ASIGNADA': 'Asignada',
        'ENEJECUCION': 'En Ejecución',
        'FINALIZADA': 'Finalizada',
        'CANCELADA': 'Cancelada'
      }
      return labels[status] || status
    },
    getPriorityClass(priority) {
      switch (priority) {
        case 'Alta':
          return 'bg-red-100 text-red-800'
        case 'Media':
          return 'bg-yellow-100 text-yellow-800'
        case 'Baja':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('es-CL')
    }
  }
}
</script>

