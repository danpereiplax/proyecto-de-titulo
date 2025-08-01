<!-- frontend/src/components/supervisor/clients/ClientModal.vue -->
<template>
  <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" @click="closeOnBackdrop">
    <div class="relative w-11/12 p-5 mx-auto bg-white border rounded-md shadow-lg top-20 md:w-2/3 lg:w-1/2" @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-medium text-gray-900">
          {{ client ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="text-xl fas fa-times"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Basic Information -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Información Básica</h4>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Razón Social *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de la empresa"
              />
              <div v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">RUT *</label>
              <input
                v-model="form.rut"
                type="text"
                required
                @blur="validateRut"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="12.345.678-9"
              />
              <div v-if="errors.rut" class="mt-1 text-sm text-red-600">{{ errors.rut }}</div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Persona de Contacto</label>
              <input
                v-model="form.contactPerson"
                type="text"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del contacto principal"
              />
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Información de Contacto</h4>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="contacto@empresa.com"
              />
              <div v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Teléfono</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Dirección</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dirección principal"
              />
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h4 class="mb-4 text-lg font-medium text-gray-900">Información Adicional</h4>
          
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Notas</label>
            <textarea
              v-model="form.notes"
              rows="4"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas adicionales sobre el cliente, preferencias, instrucciones especiales..."
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6 space-x-3 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="saving" class="mr-2 fas fa-spinner fa-spin"></i>
            <i v-else :class="client ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
            {{ saving ? 'Guardando...' : (client ? 'Actualizar Cliente' : 'Crear Cliente') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import supervisorService from '@/services/supervisorService'

export default {
  name: 'ClientModal',
  props: {
    client: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const saving = ref(false)
    
    const form = ref({
      id: null,
      name: '',
      rut: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      notes: ''
    })

    const errors = ref({})

    // Watch for client changes (edit mode)
    watch(() => props.client, (newClient) => {
      if (newClient) {
        form.value = {
          id: newClient.id,
          name: newClient.name || '',
          rut: newClient.rut || '',
          email: newClient.email || '',
          phone: newClient.phone || '',
          address: newClient.address || '',
          contactPerson: newClient.contactPerson || '',
          notes: newClient.notes || ''
        }
      } else {
        resetForm()
      }
    }, { immediate: true })

    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        rut: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        notes: ''
      }
      errors.value = {}
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!form.value.name.trim()) {
        errors.value.name = 'La razón social es requerida'
      }
      
      if (!form.value.rut.trim()) {
        errors.value.rut = 'El RUT es requerido'
      } else if (!supervisorService.validateRut(form.value.rut)) {
        errors.value.rut = 'RUT inválido'
      }
      
      if (form.value.email && !isValidEmail(form.value.email)) {
        errors.value.email = 'Email inválido'
      }
      
      return Object.keys(errors.value).length === 0
    }

    const validateRut = () => {
      if (form.value.rut && !supervisorService.validateRut(form.value.rut)) {
        errors.value.rut = 'RUT inválido'
      } else {
        delete errors.value.rut
        // Format RUT
        if (form.value.rut) {
          form.value.rut = supervisorService.formatRut(form.value.rut)
        }
      }
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      saving.value = true
      
      try {
        emit('save', { ...form.value })
      } catch (error) {
        console.error('Error saving client:', error)
      } finally {
        saving.value = false
      }
    }

    const closeOnBackdrop = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    return {
      saving,
      form,
      errors,
      handleSubmit,
      validateRut,
      closeOnBackdrop
    }
  }
}
</script>