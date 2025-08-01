<!-- frontend/src/components/supervisor/tasks/BulkAssignModal.vue -->
<template>
  <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" @click="closeOnBackdrop">
    <div class="relative w-11/12 p-5 mx-auto bg-white border rounded-md shadow-lg top-20 md:w-2/3 lg:w-1/2" @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-medium text-gray-900">
          Asignar Tareas Masivamente
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="text-xl fas fa-times"></i>
        </button>
      </div>

      <!-- Selected Tasks Summary -->
      <div class="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
        <h4 class="mb-2 text-sm font-medium text-blue-900">
          Tareas Seleccionadas ({{ tasks.length }})
        </h4>
        <div class="overflow-y-auto max-h-32">
          <ul class="space-y-1 text-sm text-blue-800">
            <li v-for="task in tasks" :key="task.id" class="truncate">
              • {{ task.title }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Assignment Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <!-- Technician Selection -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Técnico a Asignar *
          </label>
          <select
            v-model="form.technicianId"
            required
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar técnico</option>
            <option 
              v-for="tech in technicians" 
              :key="tech.id" 
              :value="tech.id"
              :disabled="!tech.active"
            >
              {{ tech.name }} 
              <span v-if="tech.tasksAssigned > 0">({{ tech.tasksAssigned }} tareas asignadas)</span>
            </option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6 space-x-3 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving || !form.technicianId"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <i v-if="saving" class="mr-2 fas fa-spinner fa-spin"></i>
            <i v-else class="mr-2 fas fa-user-plus"></i>
            {{ saving ? 'Asignando...' : `Asignar ${tasks.length} Tareas` }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BulkAssignModal',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    technicians: {
      type: Array,
      required: true
    }
  },
  emits: ['close', 'assign'],
  data() {
    return {
      saving: false,
      form: {
        technicianId: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      this.saving = true
      
      const assignmentData = {
        technicianId: this.form.technicianId,
        taskIds: this.tasks.map(task => task.id)
      }

      this.$emit('assign', assignmentData)
      this.saving = false
    },
    closeOnBackdrop(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close')
      }
    }
  }
}
</script>