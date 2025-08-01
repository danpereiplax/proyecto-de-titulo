<!-- frontend/src/components/supervisor/tasks/TaskModal.vue -->
<template>
  <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" @click="closeOnBackdrop">
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/5 xl:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto" @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-medium text-gray-900">
          {{ task ? 'Editar Tarea' : 'Nueva Tarea' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 transition-colors hover:text-gray-600">
          <i class="text-xl fas fa-times"></i>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <i class="text-2xl text-blue-600 fas fa-spinner fa-spin"></i>
        <span class="ml-2 text-gray-600">Cargando...</span>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Información Básica -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Información Básica</h4>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Título *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Instalación POS - Sucursal Centro"
              />
              <div v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</div>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción detallada de la tarea..."
              ></textarea>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Tipo de Tarea *</label>
              <select
                v-model="form.typeId"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar tipo</option>
                <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
              <div v-if="errors.typeId" class="mt-1 text-sm text-red-600">{{ errors.typeId }}</div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Prioridad</label>
              <select
                v-model="form.priority"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Baja">🟢 Baja</option>
                <option value="Media">🟡 Media</option>
                <option value="Alta">🔴 Alta</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Asignación -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Asignación</h4>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Cliente *</label>
              <select
                v-model="form.clientId"
                required
                @change="onClientChange"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cliente</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
              <div v-if="errors.clientId" class="mt-1 text-sm text-red-600">{{ errors.clientId }}</div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Técnico *</label>
              <select
                v-model="form.technicianId"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar técnico</option>
                <option 
                  v-for="tech in availableTechnicians" 
                  :key="tech.id" 
                  :value="tech.id"
                  :disabled="!tech.active"
                >
                  {{ tech.name }} 
                  <span v-if="tech.tasksAssigned > 0">({{ tech.tasksAssigned }} tareas)</span>
                  <span v-if="!tech.active">(Inactivo)</span>
                </option>
              </select>
              <div v-if="errors.technicianId" class="mt-1 text-sm text-red-600">{{ errors.technicianId }}</div>
            </div>

            <div v-if="clientLocations.length > 0">
              <label class="block mb-1 text-sm font-medium text-gray-700">Ubicación</label>
              <select
                v-model="form.locationId"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar ubicación</option>
                <option v-for="location in clientLocations" :key="location.id" :value="location.id">
                  {{ location.name }} - {{ location.address }}
                </option>
              </select>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Estado</label>
              <select
                v-model="form.status"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ASIGNADA">📋 Asignada</option>
                <option value="ENEJECUCION">⚡ En Ejecución</option>
                <option value="FINALIZADA">✅ Finalizada</option>
                <option value="CANCELADA">❌ Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Fechas -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Programación</h4>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Fecha Programada *</label>
              <input
                v-model="form.date"
                type="date"
                required
                :min="minDate"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Fecha Vencimiento</label>
              <input
                v-model="form.dueDate"
                type="date"
                :min="form.date || minDate"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Hora Inicio</label>
              <input
                v-model="form.startTime"
                type="time"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Duración Estimada (horas)</label>
              <input
                v-model="form.estimatedHours"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 2.5"
              />
            </div>
          </div>
        </div>

        <!-- Notas y Observaciones -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Notas Adicionales</h4>
          
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              v-model="form.notes"
              rows="4"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Instrucciones especiales, materiales necesarios, observaciones importantes..."
            ></textarea>
          </div>

          <!-- Checklist de Materiales -->
          <div class="mt-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">Materiales Necesarios</label>
            <div class="space-y-2">
              <div v-for="(material, index) in form.materials" :key="index" class="flex items-center space-x-2">
                <input
                  v-model="material.name"
                  type="text"
                  class="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del material"
                />
                <input
                  v-model="material.quantity"
                  type="number"
                  min="1"
                  class="w-20 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cant."
                />
                <button
                  type="button"
                  @click="removeMaterial(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <i class="text-sm fas fa-trash"></i>
                </button>
              </div>
              <button
                type="button"
                @click="addMaterial"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                <i class="mr-1 fas fa-plus"></i>Agregar Material
              </button>
            </div>
          </div>
        </div>

        <!-- Vista Previa (solo en modo edición) -->
        <div v-if="task" class="p-4 rounded-lg bg-blue-50">
          <h4 class="mb-2 text-lg font-medium text-blue-900">Información de Seguimiento</h4>
          <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <span class="font-medium text-blue-800">Creada:</span>
              <span class="text-blue-700">{{ formatDate(task.createdAt) }}</span>
            </div>
            <div v-if="task.updatedAt">
              <span class="font-medium text-blue-800">Última actualización:</span>
              <span class="text-blue-700">{{ formatDate(task.updatedAt) }}</span>
            </div>
            <div v-if="task.assignedAt">
              <span class="font-medium text-blue-800">Asignada:</span>
              <span class="text-blue-700">{{ formatDate(task.assignedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-end pt-6 space-x-3 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          
          <button
            v-if="task"
            type="button"
            @click="duplicateTask"
            class="px-6 py-2 text-sm font-medium text-blue-700 transition-colors border border-blue-300 rounded-md hover:bg-blue-50"
          >
            <i class="mr-2 fas fa-copy"></i>Duplicar
          </button>
          
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="saving" class="mr-2 fas fa-spinner fa-spin"></i>
            <i v-else :class="task ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
            {{ saving ? 'Guardando...' : (task ? 'Actualizar Tarea' : 'Crear Tarea') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import supervisorService from '@/services/supervisorService'

export default {
  name: 'TaskModal',
  props: {
    task: {
      type: Object,
      default: null
    },
    technicians: {
      type: Array,
      required: true
    },
    clients: {
      type: Array,
      required: true
    },
    taskTypes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const loading = ref(false)
    const saving = ref(false)
    const clientLocations = ref([])
    
    const form = ref({
      id: null,
      title: '',
      description: '',
      typeId: '',
      priority: 'Media',
      clientId: '',
      technicianId: '',
      locationId: '',
      status: 'ASIGNADA',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      startTime: '09:00',
      estimatedHours: 2,
      notes: '',
      materials: []
    })

    const errors = ref({})

    // Computed
    const minDate = computed(() => {
      return new Date().toISOString().split('T')[0]
    })

    const availableTechnicians = computed(() => {
      return props.technicians.map(tech => ({
        ...tech,
        available: tech.active && tech.tasksAssigned < 5 // Límite de tareas
      })).sort((a, b) => {
        if (a.active !== b.active) return b.active - a.active
        return a.tasksAssigned - b.tasksAssigned
      })
    })

    // Watch for task changes (edit mode)
    watch(() => props.task, (newTask) => {
      if (newTask) {
        form.value = {
          id: newTask.id,
          title: newTask.title || '',
          description: newTask.description || '',
          typeId: newTask.typeId || '',
          priority: newTask.priority || 'Media',
          clientId: newTask.clientId || '',
          technicianId: newTask.technicianId || '',
          locationId: newTask.locationId || '',
          status: newTask.status || 'ASIGNADA',
          date: newTask.date || new Date().toISOString().split('T')[0],
          dueDate: newTask.dueDate || '',
          startTime: newTask.startTime || '09:00',
          estimatedHours: newTask.estimatedHours || 2,
          notes: newTask.notes || '',
          materials: newTask.materials || []
        }
        
        if (newTask.clientId) {
          loadClientLocations(newTask.clientId)
        }
      } else {
        resetForm()
      }
    }, { immediate: true })

    // Methods
    const resetForm = () => {
      form.value = {
        id: null,
        title: '',
        description: '',
        typeId: '',
        priority: 'Media',
        clientId: '',
        technicianId: '',
        locationId: '',
        status: 'ASIGNADA',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        startTime: '09:00',
        estimatedHours: 2,
        notes: '',
        materials: []
      }
      errors.value = {}
      clientLocations.value = []
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!form.value.title.trim()) {
        errors.value.title = 'El título es requerido'
      }
      
      if (!form.value.typeId) {
        errors.value.typeId = 'Debe seleccionar un tipo de tarea'
      }
      
      if (!form.value.clientId) {
        errors.value.clientId = 'Debe seleccionar un cliente'
      }
      
      if (!form.value.technicianId) {
        errors.value.technicianId = 'Debe asignar un técnico'
      }
      
      if (!form.value.date) {
        errors.value.date = 'La fecha es requerida'
      }
      
      return Object.keys(errors.value).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      saving.value = true
      
      try {
        // Get additional data for display
        const technician = props.technicians.find(t => t.id === form.value.technicianId)
        const client = props.clients.find(c => c.id === form.value.clientId)
        const taskType = props.taskTypes.find(t => t.id === form.value.typeId)

        const taskData = {
          ...form.value,
          technician: technician?.name || '',
          client: client?.name || '',
          typeName: taskType?.name || ''
        }

        emit('save', taskData)
      } catch (error) {
        console.error('Error saving task:', error)
      } finally {
        saving.value = false
      }
    }

    const onClientChange = async () => {
      if (form.value.clientId) {
        await loadClientLocations(form.value.clientId)
      } else {
        clientLocations.value = []
      }
      form.value.locationId = ''
    }

    const loadClientLocations = async (clientId) => {
      try {
        // En un escenario real, cargarías las ubicaciones del cliente
        // const locations = await supervisorService.getClientLocations(clientId)
        // clientLocations.value = locations
        
        // Mock data por ahora
        clientLocations.value = [
          { id: 1, name: 'Sucursal Centro', address: 'Av. Principal 123' },
          { id: 2, name: 'Sucursal Norte', address: 'Calle Norte 456' }
        ]
      } catch (error) {
        console.error('Error loading client locations:', error)
        clientLocations.value = []
      }
    }

    const addMaterial = () => {
      form.value.materials.push({ name: '', quantity: 1 })
    }

    const removeMaterial = (index) => {
      form.value.materials.splice(index, 1)
    }

    const duplicateTask = () => {
      const duplicatedTask = {
        ...form.value,
        id: null,
        title: `${form.value.title} (Copia)`,
        status: 'ASIGNADA',
        date: new Date().toISOString().split('T')[0]
      }
      form.value = duplicatedTask
    }

    const closeOnBackdrop = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleString('es-CL')
    }

    // Lifecycle
    onMounted(() => {
      // Initialize materials array if empty
      if (form.value.materials.length === 0) {
        form.value.materials = []
      }
    })

    return {
      loading,
      saving,
      form,
      errors,
      clientLocations,
      minDate,
      availableTechnicians,
      handleSubmit,
      onClientChange,
      addMaterial,
      removeMaterial,
      duplicateTask,
      closeOnBackdrop,
      formatDate,
      validateForm,
      resetForm
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar para el modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>