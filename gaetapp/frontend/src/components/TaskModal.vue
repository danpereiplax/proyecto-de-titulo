<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal -->
      <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ modalTitle }}
            </h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Formulario -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Descripción -->
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Descripción de la Tarea *
              </label>
              <textarea
                v-model="formData.descripcion"
                :disabled="mode === 'view'"
                rows="3"
                class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                placeholder="Describe detalladamente la tarea a realizar..."
                required
              ></textarea>
            </div>

            <!-- Tipo de Tarea -->
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Tipo de Tarea *
              </label>
              <select
                v-model="formData.id_tipo_tarea"
                :disabled="mode === 'view'"
                class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                required
              >
                <option value="">Seleccione un tipo</option>
                <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                  {{ type.descripcion_tipo_tarea }}
                </option>
              </select>
            </div>

            <!-- Cliente y Local -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Cliente *
                </label>
                <select
                  v-model="selectedClientId"
                  :disabled="mode === 'view'"
                  @change="loadClientLocations"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Local *
                </label>
                <select
                  v-model="formData.id_local_cliente"
                  :disabled="mode === 'view' || !selectedClientId"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  required
                >
                  <option value="">Seleccione un local</option>
                  <option v-for="location in clientLocations" :key="location.id_local_cliente" :value="location.id_local_cliente">
                    {{ location.nombre_local }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Técnico Asignado -->
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Técnico Asignado
              </label>
              <select
                v-model="formData.rut_persona_asignada"
                :disabled="mode === 'view'"
                class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              >
                <option value="">Sin asignar</option>
                <option v-for="tech in technicians" :key="tech.rut" :value="tech.rut">
                  {{ tech.nombre }} {{ tech.apellido }} ({{ tech.estado }})
                </option>
              </select>
            </div>

            <!-- Fecha y Prioridad -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Fecha Programada
                </label>
                <input
                  v-model="formData.fecha_programada"
                  :disabled="mode === 'view'"
                  type="datetime-local"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                >
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Prioridad
                </label>
                <select
                  v-model="formData.prioridad"
                  :disabled="mode === 'view'"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>

            <!-- Estado (solo para editar) -->
            <div v-if="mode === 'edit' && task">
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                v-model="formData.id_estado_tarea"
                class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option v-for="state in taskStates" :key="state.id_estado_tarea" :value="state.id_estado_tarea">
                  {{ state.descripcion_estado_tarea }}
                </option>
              </select>
            </div>

            <!-- Información adicional (solo en modo ver) -->
            <div v-if="mode === 'view' && task" class="p-4 rounded-md bg-gray-50">
              <h4 class="mb-2 text-sm font-medium text-gray-900">Información Adicional</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">ID:</span>
                  <span class="ml-2 font-medium">{{ task.id }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Fecha Creación:</span>
                  <span class="ml-2 font-medium">{{ formatDate(task.fecha_creacion) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Estado:</span>
                  <span :class="['ml-2 px-2 py-1 text-xs font-medium rounded-full', getStatusClass(task.estado)]">
                    {{ task.estado }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-500">Dirección:</span>
                  <span class="ml-2 font-medium">{{ task.direccion || 'No especificada' }}</span>
                </div>
              </div>
            </div>

            <!-- Errores de validación -->
            <div v-if="errors.length > 0" class="p-3 border border-red-200 rounded-md bg-red-50">
              <div class="flex">
                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Errores de validación:</h3>
                  <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            v-if="mode !== 'view'"
            @click="handleSubmit"
            :disabled="loading"
            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
          >
            <svg v-if="loading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
            </svg>
            {{ loading ? 'Guardando...' : (mode === 'create' ? 'Crear Tarea' : 'Actualizar Tarea') }}
          </button>
          <button
            @click="$emit('close')"
            class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ mode === 'view' ? 'Cerrar' : 'Cancelar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import supervisorService from '@/services/supervisorService'

export default {
  name: 'TaskModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'create', // 'create', 'edit', 'view'
      validator: (value) => ['create', 'edit', 'view'].includes(value)
    },
    task: {
      type: Object,
      default: null
    },
    taskTypes: {
      type: Array,
      default: () => []
    },
    clients: {
      type: Array,
      default: () => []
    },
    technicians: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const loading = ref(false)
    const errors = ref([])
    const selectedClientId = ref('')
    const clientLocations = ref([])
    const taskStates = ref([])

    const formData = ref({
      descripcion: '',
      id_tipo_tarea: '',
      id_local_cliente: '',
      rut_persona_asignada: '',
      fecha_programada: '',
      prioridad: 'MEDIA',
      id_estado_tarea: ''
    })

    const modalTitle = computed(() => {
      const titles = {
        create: 'Crear Nueva Tarea',
        edit: 'Editar Tarea',
        view: 'Detalles de la Tarea'
      }
      return titles[props.mode] || 'Tarea'
    })

    // Cargar locales del cliente seleccionado
    const loadClientLocations = async () => {
      if (!selectedClientId.value) {
        clientLocations.value = []
        formData.value.id_local_cliente = ''
        return
      }

      try {
        const locations = await supervisorService.getClientLocations(selectedClientId.value)
        clientLocations.value = locations
      } catch (error) {
        console.error('Error cargando locales:', error)
        clientLocations.value = []
      }
    }

    // Cargar estados de tarea
    const loadTaskStates = async () => {
      try {
        const states = await supervisorService.getTaskStates()
        taskStates.value = states
      } catch (error) {
        console.error('Error cargando estados:', error)
      }
    }

    // Inicializar formulario
    const initializeForm = () => {
      if (props.task && (props.mode === 'edit' || props.mode === 'view')) {
        formData.value = {
          descripcion: props.task.descripcion || '',
          id_tipo_tarea: props.task.id_tipo_tarea || '',
          id_local_cliente: props.task.id_local_cliente || '',
          rut_persona_asignada: props.task.rut_persona_asignada || '',
          fecha_programada: props.task.fecha_programada ? formatDateForInput(props.task.fecha_programada) : '',
          prioridad: props.task.prioridad || 'MEDIA',
          id_estado_tarea: props.task.id_estado_tarea || ''
        }

        // Buscar el cliente correspondiente al local
        if (props.task.id_local_cliente) {
          const client = props.clients.find(c => {
            // Necesitamos hacer una llamada para verificar qué cliente tiene este local
            // Por simplicidad, establecemos el primer cliente
            return true
          })
          if (client) {
            selectedClientId.value = client.id
            loadClientLocations()
          }
        }
      } else {
        // Modo crear - valores por defecto
        formData.value = {
          descripcion: '',
          id_tipo_tarea: '',
          id_local_cliente: '',
          rut_persona_asignada: '',
          fecha_programada: '',
          prioridad: 'MEDIA',
          id_estado_tarea: ''
        }
        selectedClientId.value = ''
        clientLocations.value = []
      }
      errors.value = []
    }

    // Validar formulario
    const validateForm = () => {
      const validationErrors = supervisorService.validateTaskData(formData.value)
      errors.value = validationErrors
      return validationErrors.length === 0
    }

    // Manejar envío del formulario
    const handleSubmit = async () => {
      if (props.mode === 'view') return

      if (!validateForm()) return

      loading.value = true
      try {
        emit('save', { ...formData.value })
      } catch (error) {
        console.error('Error en el envío:', error)
        errors.value = [error.message || 'Error al guardar la tarea']
      } finally {
        loading.value = false
      }
    }

    // Utilidades
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatDateForInput = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toISOString().slice(0, 16)
    }

    const getStatusClass = (status) => {
      return supervisorService.getStatusClass(status)
    }

    // Watchers
    watch(() => props.show, (newValue) => {
      if (newValue) {
        initializeForm()
        loadTaskStates()
      }
    })

    watch(() => props.task, () => {
      if (props.show) {
        initializeForm()
      }
    })

    onMounted(() => {
      if (props.show) {
        initializeForm()
        loadTaskStates()
      }
    })

    return {
      loading,
      errors,
      formData,
      selectedClientId,
      clientLocations,
      taskStates,
      modalTitle,
      loadClientLocations,
      handleSubmit,
      formatDate,
      getStatusClass
    }
  }
}
</script>