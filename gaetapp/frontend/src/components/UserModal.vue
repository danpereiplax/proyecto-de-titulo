<!-- frontend/src/components/UserModal.vue -->
<template>
  <!-- Modal Backdrop -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <!-- Modal Container -->
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ user ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- RUT -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">RUT *</label>
            <input
              v-model="form.rut_persona"
              type="number"
              required
              :disabled="!!user"
              placeholder="12345678"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">DV *</label>
            <input
              v-model="form.rut_dv_persona"
              type="text"
              required
              :disabled="!!user"
              maxlength="1"
              placeholder="9"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Nombres -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre *</label>
            <input
              v-model="form.nombre_persona"
              type="text"
              required
              placeholder="Juan"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Apellido Paterno *</label>
            <input
              v-model="form.apellido_paterno_persona"
              type="text"
              required
              placeholder="Pérez"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Apellido Materno -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Apellido Materno</label>
          <input
            v-model="form.apellido_materno_persona"
            type="text"
            placeholder="López"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre de Usuario *</label>
          <input
            v-model="form.username"
            type="text"
            required
            placeholder="juan.perez"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Email Corporativo *</label>
          <input
            v-model="form.email_corporativo"
            type="email"
            required
            placeholder="juan.perez@infomaxis.cl"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            v-model="form.telefono"
            type="tel"
            placeholder="+56912345678"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <!-- Perfil -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Perfil *</label>
          <select
            v-model="form.id_perfil_usuario"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleccionar perfil</option>
            <option value="1">ADMINISTRADOR</option>
            <option value="2">SUPERVISOR</option>
            <option value="4">TECNICO</option>
          </select>
        </div>

        <!-- Estado (solo en edición) -->
        <div v-if="user" class="flex items-center">
          <input
            v-model="form.activo"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label class="ml-2 block text-sm text-gray-900">Usuario activo</label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Guardando...
            </span>
            <span v-else>
              {{ user ? 'Actualizar' : 'Crear' }} Usuario
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'UserModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')
    
    const form = ref({
      rut_persona: '',
      rut_dv_persona: '',
      nombre_persona: '',
      apellido_paterno_persona: '',
      apellido_materno_persona: '',
      username: '',
      email_corporativo: '',
      telefono: '',
      id_perfil_usuario: '',
      activo: true
    })

    // Watch para llenar el formulario cuando se edita un usuario
    watch(() => props.user, (newUser) => {
      if (newUser) {
        form.value = {
          rut_persona: newUser.rut_persona,
          rut_dv_persona: newUser.rut_dv_persona,
          nombre_persona: newUser.nombre_persona,
          apellido_paterno_persona: newUser.apellido_paterno_persona,
          apellido_materno_persona: newUser.apellido_materno_persona || '',
          username: newUser.username || '',
          email_corporativo: newUser.email_corporativo,
          telefono: newUser.telefono || '',
          id_perfil_usuario: newUser.id_perfil_usuario,
          activo: newUser.activo !== false
        }
      } else {
        // Resetear formulario para nuevo usuario
        form.value = {
          rut_persona: '',
          rut_dv_persona: '',
          nombre_persona: '',
          apellido_paterno_persona: '',
          apellido_materno_persona: '',
          username: '',
          email_corporativo: '',
          telefono: '',
          id_perfil_usuario: '',
          activo: true
        }
      }
      error.value = ''
    }, { immediate: true })

    const closeModal = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        // Validaciones básicas
        if (!form.value.rut_persona || !form.value.rut_dv_persona) {
          throw new Error('RUT y DV son obligatorios')
        }
        
        if (!form.value.nombre_persona || !form.value.apellido_paterno_persona) {
          throw new Error('Nombre y apellido paterno son obligatorios')
        }
        
        if (!form.value.email_corporativo) {
          throw new Error('Email corporativo es obligatorio')
        }
        
        if (!form.value.id_perfil_usuario) {
          throw new Error('Debe seleccionar un perfil')
        }

        // Generar username automáticamente si no se proporciona
        if (!form.value.username) {
          form.value.username = `${form.value.nombre_persona}.${form.value.apellido_paterno_persona}`.toLowerCase().replace(/\s+/g, '.')
        }

        emit('save', form.value)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      closeModal,
      handleSubmit
    }
  }
}
</script>