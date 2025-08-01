<!-- frontend/src/components/supervisor/TasksManagement.vue -->
<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h2 class="text-xl font-semibold text-gray-900">Gestión de Tareas</h2>
        <p class="mt-2 text-sm text-gray-700">Crea, asigna y supervisa las tareas técnicas.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button @click="$emit('show-toast', 'Funcionalidad próximamente', 'info')" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
          <i class="mr-2 fas fa-plus"></i>
          Nueva Tarea
        </button>
      </div>
    </div>

    <!-- Lista de Tareas -->
    <div class="overflow-hidden bg-white shadow sm:rounded-md">
      <div v-if="loading" class="p-8 text-center">
        <i class="mb-4 text-3xl text-gray-400 fas fa-spinner fa-spin"></i>
        <p class="text-gray-500">Cargando tareas...</p>
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="task in tasks" :key="task.id" class="px-6 py-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-900">
                  {{ task.title }}
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getTaskStatusClass(task.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ task.status }}
                  </span>
                  <span class="text-xs text-gray-500">{{ task.priority }}</span>
                </div>
              </div>
              <div class="flex items-center mt-2 text-sm text-gray-500">
                <i class="mr-1 fas fa-user"></i>
                {{ task.technician }}
                <i class="ml-4 mr-1 fas fa-building"></i>
                {{ task.client }}
                <i class="ml-4 mr-1 fas fa-calendar"></i>
                {{ formatDate(task.date) }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TasksManagement',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    technicians: {
      type: Array,
      required: true
    },
    clients: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['task-created', 'task-updated', 'task-deleted', 'show-toast'],
  methods: {
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
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-CL')
    }
  }
}
</script>