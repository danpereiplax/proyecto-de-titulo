<!-- frontend/src/components/supervisor/SystemConfiguration.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>
      <p class="mt-2 text-sm text-gray-700">Configura tipos de tarea, estados y áreas de cobro.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Tipos de Tarea -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Tipos de Tarea</h3>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="type in taskTypes" :key="type.id" class="flex items-center justify-between">
              <span class="text-sm text-gray-900">{{ type.name }}</span>
              <button @click="removeTaskType(type)" class="text-red-600 hover:text-red-900">
                <i class="text-xs fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="flex mt-4">
            <input 
              v-model="newTaskType" 
              @keyup.enter="addTaskType"
              type="text" 
              placeholder="Nuevo tipo de tarea"
              class="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button @click="addTaskType" class="inline-flex items-center px-3 py-2 ml-3 text-sm font-medium leading-4 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Áreas de Cobro -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Áreas de Cobro</h3>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="area in billingAreas" :key="area.id" class="flex items-center justify-between">
              <span class="text-sm text-gray-900">{{ area.name }}</span>
              <button @click="removeBillingArea(area)" class="text-red-600 hover:text-red-900">
                <i class="text-xs fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="flex mt-4">
            <input 
              v-model="newBillingArea" 
              @keyup.enter="addBillingArea"
              type="text" 
              placeholder="Nueva área de cobro"
              class="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button @click="addBillingArea" class="inline-flex items-center px-3 py-2 ml-3 text-sm font-medium leading-4 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemConfiguration',
  props: {
    taskTypes: {
      type: Array,
      required: true
    },
    billingAreas: {
      type: Array,
      required: true
    }
  },
  emits: ['task-type-added', 'task-type-removed', 'billing-area-added', 'billing-area-removed', 'show-toast'],
  data() {
    return {
      newTaskType: '',
      newBillingArea: ''
    }
  },
  methods: {
    addTaskType() {
      if (this.newTaskType.trim()) {
        const newId = Math.max(...this.taskTypes.map(t => t.id), 0) + 1
        this.$emit('task-type-added', {
          id: newId,
          name: this.newTaskType.trim()
        })
        this.newTaskType = ''
      }
    },
    removeTaskType(type) {
      if (confirm(`¿Eliminar el tipo de tarea "${type.name}"?`)) {
        this.$emit('task-type-removed', type.id)
      }
    },
    addBillingArea() {
      if (this.newBillingArea.trim()) {
        const newId = Math.max(...this.billingAreas.map(a => a.id), 0) + 1
        this.$emit('billing-area-added', {
          id: newId,
          name: this.newBillingArea.trim()
        })
        this.newBillingArea = ''
      }
    },
    removeBillingArea(area) {
      if (confirm(`¿Eliminar el área de cobro "${area.name}"?`)) {
        this.$emit('billing-area-removed', area.id)
      }
    }
  }
}
</script>