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
            <!-- Información Básica -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Nombre de la Empresa *
                </label>
                <input
                  v-model="formData.nombre"
                  :disabled="mode === 'view'"
                  type="text"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  placeholder="Nombre de la empresa o cliente"
                  required
                >
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  RUT *
                </label>
                <input
                  v-model="formData.rut"
                  :disabled="mode === 'view'"
                  type="text"
                  @input="formatRUT"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  placeholder="12.345.678-9"
                  required
                >
              </div>
            </div>

            <!-- Información de Contacto -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  v-model="formData.email"
                  :disabled="mode === 'view'"
                  type="email"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  placeholder="contacto@empresa.cl"
                >
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  v-model="formData.telefono"
                  :disabled="mode === 'view'"
                  type="text"
                  @input="formatPhone"
                  class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  placeholder="+56 9 1234 5678"
                >
              </div>
            </div>

            <!-- Dirección Principal -->
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Dirección Principal
              </label>
              <input
                v-model="formData.direccion"
                :disabled="mode === 'view'"
                type="text"
                class="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                placeholder="Av. Providencia 1234, Santiago"
              >
              <p class="mt-1 text-xs text-gray-500">
                Se creará automáticamente un local principal con esta dirección
              </p>
            </div>

            <!-- Información adicional (solo en modo ver) -->
            <div v-if="mode === 'view' && client" class="p-4 rounded-md bg-gray-50">
              <h4 class="mb-3 text-sm font-medium text-gray-900">Información Adicional</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">ID Cliente:</span>
                  <span class="ml-2 font-medium">{{ client.id }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Estado:</span>
                  <span :class="['ml-2 px-2 py-1 text-xs font-medium rounded-full', client.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ client.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-500">Total Locales:</span>
                  <span class="ml-2 font-medium">{{ client.locales_count || 0 }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Tareas Activas:</span>
                  <span class="ml-2 font-medium text-blue-600">{{ client.tareas_activas || 0 }}</span>
                </div>
              </div>
              
              <!-- Historial de actividad -->
              <div class="mt-4">
                <h5 class="mb-2 text-sm font-medium text-gray-900">Actividad Reciente</h5>
                <div class="space-y-2">
                  <div v-if="!client.tareas_activas" class="text-xs italic text-gray-500">
                    No hay actividad reciente
                  </div>
                  <div v-else class="text-xs text-gray-600">
                    {{ client.tareas_activas }} tareas activas en este momento
                  </div>
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

            <!-- Validación RUT en tiempo real -->
            <div v-if="formData.rut && !isValidRUT && mode !== 'view'" class="p-3 border border-yellow-200 rounded-md bg-yellow-50">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-yellow-800">
                    El RUT ingresado no es válido. Verifique el formato y el dígito verificador.
                  </p>
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
            :disabled="loading || (formData.rut && !isValidRUT)"
            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
          >
            <svg v-if="loading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
            </svg>
            {{ loading ? 'Guardando...' : (mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente') }}
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
  name: 'ClientModal',
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
    client: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const loading = ref(false)
    const errors = ref([])

    const formData = ref({
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      direccion: ''
    })

    const modalTitle = computed(() => {
      const titles = {
        create: 'Crear Nuevo Cliente',
        edit: 'Editar Cliente',
        view: 'Detalles del Cliente'
      }
      return titles[props.mode] || 'Cliente'
    })

    const isValidRUT = computed(() => {
      if (!formData.value.rut) return null
      return supervisorService.validateRUT(formData.value.rut)
    })

    // Inicializar formulario
    const initializeForm = () => {
      if (props.client && (props.mode === 'edit' || props.mode === 'view')) {
        formData.value = {
          nombre: props.client.nombre || '',
          rut: props.client.rut || '',
          email: props.client.email || '',
          telefono: props.client.telefono || '',
          direccion: props.client.direccion || ''
        }
      } else {
        // Modo crear - valores por defecto
        formData.value = {
          nombre: '',
          rut: '',
          email: '',
          telefono: '',
          direccion: ''
        }
      }
      errors.value = []
    }

    // Formatear RUT mientras se escribe
    const formatRUT = (event) => {
      let value = event.target.value.replace(/[^0-9kK]/g, '')
      
      if (value.length > 1) {
        const rut = value.slice(0, -1)
        const dv = value.slice(-1)
        
        // Agregar puntos cada 3 dígitos
        const formattedRut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        formData.value.rut = `${formattedRut}-${dv}`
      } else {
        formData.value.rut = value
      }
    }

    // Formatear teléfono mientras se escribe
    const formatPhone = (event) => {
      let value = event.target.value.replace(/\D/g, '')
      
      if (value.length > 0) {
        if (value.startsWith('56')) {
          // Formato internacional chileno
          const countryCode = value.slice(0, 2)
          const areaCode = value.slice(2, 3)
          const number = value.slice(3)
          
          if (number.length > 4) {
            formData.value.telefono = `+${countryCode} ${areaCode} ${number.slice(0, 4)} ${number.slice(4, 8)}`
          } else if (number.length > 0) {
            formData.value.telefono = `+${countryCode} ${areaCode} ${number}`
          } else if (areaCode) {
            formData.value.telefono = `+${countryCode} ${areaCode}`
          } else {
            formData.value.telefono = `+${countryCode}`
          }
        } else if (value.startsWith('9')) {
          // Formato nacional chileno (móvil)
          if (value.length > 4) {
            formData.value.telefono = `+56 ${value.slice(0, 1)} ${value.slice(1, 5)} ${value.slice(5, 9)}`
          } else if (value.length > 1) {
            formData.value.telefono = `+56 ${value.slice(0, 1)} ${value.slice(1)}`
          } else {
            formData.value.telefono = `+56 ${value}`
          }
        } else {
          // Formato nacional chileno (fijo)
          if (value.length > 1) {
            formData.value.telefono = `+56 ${value.slice(0, 1)} ${value.slice(1)}`
          } else {
            formData.value.telefono = `+56 ${value}`
          }
        }
      } else {
        formData.value.telefono = ''
      }
    }

    // Validar formulario
    const validateForm = () => {
      const validationErrors = supervisorService.validateClientData(formData.value)
      errors.value = validationErrors
      return validationErrors.length === 0
    }

    // Manejar envío del formulario
    const handleSubmit = async () => {
      if (props.mode === 'view') return

      if (!validateForm()) return

      // Validación adicional del RUT
      if (formData.value.rut && !isValidRUT.value) {
        errors.value.push('El RUT ingresado no es válido')
        return
      }

      loading.value = true
      try {
        emit('save', { ...formData.value })
      } catch (error) {
        console.error('Error en el envío:', error)
        errors.value = [error.message || 'Error al guardar el cliente']
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(() => props.show, (newValue) => {
      if (newValue) {
        initializeForm()
      }
    })

    watch(() => props.client, () => {
      if (props.show) {
        initializeForm()
      }
    })

    onMounted(() => {
      if (props.show) {
        initializeForm()
      }
    })

    return {
      loading,
      errors,
      formData,
      modalTitle,
      isValidRUT,
      formatRUT,
      formatPhone,
      handleSubmit
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.disabled\:bg-gray-50:disabled {
  background-color: #f9fafb;
}
</style>