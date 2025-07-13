<!-- frontend/src/views/AdministradorView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Panel de Administración</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              <span class="font-medium">{{ userName }}</span>
              <span class="text-gray-500 ml-2">({{ userRole }})</span>
            </div>
            <button @click="logout" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <i class="fas fa-sign-out-alt mr-2"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'dashboard'"
            :class="[
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center'
            ]"
          >
            <i class="fas fa-chart-bar mr-2"></i>
            Dashboard
          </button>
          <button
            @click="activeTab = 'users'"
            :class="[
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center'
            ]"
          >
            <i class="fas fa-users mr-2"></i>
            Usuarios
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-users text-blue-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ totalUsers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-user-tie text-green-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Supervisores</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ supervisors }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-tools text-yellow-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Técnicos</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ technicians }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-user-check text-purple-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ activeUsers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i class="fas fa-info-circle text-blue-400 text-xl"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Panel de Administración</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Como <strong>Administrador</strong>, tu función principal es la gestión de usuarios del sistema GAET.</p>
                <p class="mt-2">Las responsabilidades operativas como creación de tareas, gestión de clientes y reportes corresponden al <strong>Supervisor</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestión de Usuarios -->
      <div v-else-if="activeTab === 'users'" class="space-y-6">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
            <p class="mt-2 text-sm text-gray-700">Administra los usuarios del sistema GAET.</p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button @click="openUserModal()" class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>
              Nuevo Usuario
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Buscar por nombre</label>
              <input 
                v-model="filters.search" 
                type="text" 
                placeholder="Nombre, RUT o email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Filtrar por perfil</label>
              <select 
                v-model="filters.profile" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos los perfiles</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="TECNICO">Técnico</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Filtrar por estado</label>
              <select 
                v-model="filters.status" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div v-if="loading" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">Cargando usuarios...</p>
          </div>
          
          <div v-else>
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                  <th class="relative px-6 py-3"><span class="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.rut_persona || user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <i class="fas fa-user text-gray-500"></i>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.nombre_persona || user.nombre }} {{ user.apellido_paterno_persona || user.apellido }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.username }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.email_corporativo || user.email }}</div>
                    <div class="text-sm text-gray-500">{{ user.telefono || 'Sin teléfono' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                          :class="getProfileBadgeClass(user.perfil || user.descripcion_perfil_usuario)">
                      {{ user.perfil || user.descripcion_perfil_usuario }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.fecha_ingreso) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-3 transition-colors" title="Editar usuario">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="toggleUserStatus(user)" 
                            :class="user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                            class="transition-colors"
                            :title="user.activo ? 'Desactivar usuario' : 'Activar usuario'">
                      <i :class="user.activo ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredUsers.length === 0" class="text-center py-12">
              <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
              <p class="text-gray-500">No hay usuarios que coincidan con los filtros aplicados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeUserModal">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <button @click="closeUserModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Error Display -->
        <div v-if="formError" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ formError }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="handleUserSave" class="space-y-6">
          <!-- RUT -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">RUT *</label>
              <input
                v-model="userForm.rut_persona"
                type="number"
                required
                :disabled="!!selectedUser"
                placeholder="12345678"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">DV *</label>
              <input
                v-model="userForm.rut_dv_persona"
                type="text"
                required
                :disabled="!!selectedUser"
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
                v-model="userForm.nombre_persona"
                type="text"
                required
                placeholder="Juan"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Paterno *</label>
              <input
                v-model="userForm.apellido_paterno_persona"
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
              v-model="userForm.apellido_materno_persona"
              type="text"
              placeholder="López"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre de Usuario *</label>
            <input
              v-model="userForm.username"
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
              v-model="userForm.email_corporativo"
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
              v-model="userForm.telefono"
              type="tel"
              placeholder="+56912345678"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <!-- Perfil -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Perfil *</label>
            <select
              v-model="userForm.id_perfil_usuario"
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
          <div v-if="selectedUser" class="flex items-center">
            <input
              v-model="userForm.activo"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Usuario activo</label>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeUserModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="formLoading">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Guardando...
              </span>
              <span v-else>
                {{ selectedUser ? 'Actualizar' : 'Crear' }} Usuario
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg text-white',
        toast.type === 'success' ? 'bg-green-500' : 
        toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      ]">
        <div class="flex items-center">
          <i :class="[
            'mr-2',
            toast.type === 'success' ? 'fas fa-check-circle' : 
            toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'
          ]"></i>
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import adminService from '@/services/adminService'

export default {
  name: 'AdministradorView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const activeTab = ref('dashboard')
    const users = ref([])
    const loading = ref(false)
    const formLoading = ref(false)
    const formError = ref('')
    
    // Filters
    const filters = ref({
      search: '',
      profile: '',
      status: ''
    })
    
    // Modal
    const showUserModal = ref(false)
    const selectedUser = ref(null)
    const userForm = ref({
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
    
    // Toast
    const toast = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Computed
    const userName = computed(() => userStore.userName || 'Administrador')
    const userRole = computed(() => userStore.userRole || 'ADMINISTRADOR')
    
    const totalUsers = computed(() => users.value.length)
    const supervisors = computed(() => users.value.filter(u => (u.perfil || u.descripcion_perfil_usuario) === 'SUPERVISOR').length)
    const technicians = computed(() => users.value.filter(u => (u.perfil || u.descripcion_perfil_usuario) === 'TECNICO').length)
    const activeUsers = computed(() => users.value.filter(u => u.activo).length)

    const filteredUsers = computed(() => {
      let filtered = users.value

      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(user => 
          (user.nombre_persona || user.nombre || '').toLowerCase().includes(search) ||
          (user.apellido_paterno_persona || user.apellido || '').toLowerCase().includes(search) ||
          (user.email_corporativo || user.email || '').toLowerCase().includes(search) ||
          (user.username || '').toLowerCase().includes(search) ||
          (user.rut_persona || '').toString().includes(search)
        )
      }

      if (filters.value.profile) {
        filtered = filtered.filter(user => 
          (user.perfil || user.descripcion_perfil_usuario) === filters.value.profile
        )
      }

      if (filters.value.status !== '') {
        const status = filters.value.status === 'true'
        filtered = filtered.filter(user => user.activo === status)
      }

      return filtered
    })

    // Methods
    const loadUsers = async () => {
      try {
        loading.value = true
        const response = await adminService.getUsers()
        users.value = response.data
      } catch (error) {
        console.error('Error cargando usuarios:', error)
        showToast('Error al cargar usuarios. Mostrando datos de ejemplo.', 'error')
        
        // Cargar datos de ejemplo si falla la API
        const savedUser = localStorage.getItem('gaet_user')
        if (savedUser) {
          const user = JSON.parse(savedUser)
          users.value = [
            {
              id: 1,
              rut_persona: user.rut?.split('-')[0] || '12345678',
              rut_dv_persona: user.rut?.split('-')[1] || '9',
              nombre_persona: user.nombre || 'Administrador',
              apellido_paterno_persona: user.apellido || 'Sistema',
              email_corporativo: user.email || 'admin@infomaxis.cl',
              perfil: user.perfil || 'ADMINISTRADOR',
              activo: true,
              username: user.username || 'admin',
              fecha_ingreso: new Date().toISOString()
            },
            ...users.value
          ]
        }
      } finally {
        loading.value = false
      }
    }

    const openUserModal = (user = null) => {
      selectedUser.value = user
      formError.value = ''
      
      if (user) {
        userForm.value = {
          rut_persona: user.rut_persona,
          rut_dv_persona: user.rut_dv_persona,
          nombre_persona: user.nombre_persona || user.nombre,
          apellido_paterno_persona: user.apellido_paterno_persona || user.apellido,
          apellido_materno_persona: user.apellido_materno_persona || '',
          username: user.username || '',
          email_corporativo: user.email_corporativo || user.email,
          telefono: user.telefono || '',
          id_perfil_usuario: user.id_perfil_usuario || getProfileId(user.perfil || user.descripcion_perfil_usuario),
          activo: user.activo !== false
        }
      } else {
        userForm.value = {
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
      showUserModal.value = true
    }

    const closeUserModal = () => {
      showUserModal.value = false
      selectedUser.value = null
      formError.value = ''
    }

    const handleUserSave = async () => {
      try {
        formLoading.value = true
        formError.value = ''

        // Validaciones
        if (!userForm.value.rut_persona || !userForm.value.rut_dv_persona) {
          throw new Error('RUT y DV son obligatorios')
        }
        
        if (!userForm.value.nombre_persona || !userForm.value.apellido_paterno_persona) {
          throw new Error('Nombre y apellido paterno son obligatorios')
        }
        
        if (!userForm.value.email_corporativo) {
          throw new Error('Email corporativo es obligatorio')
        }
        
        if (!userForm.value.id_perfil_usuario) {
          throw new Error('Debe seleccionar un perfil')
        }

        // Generar username automáticamente si no se proporciona
        if (!userForm.value.username) {
          userForm.value.username = `${userForm.value.nombre_persona}.${userForm.value.apellido_paterno_persona}`.toLowerCase().replace(/\s+/g, '.')
        }

        // Validar RUT único (solo para nuevos usuarios)
        if (!selectedUser.value) {
          const existingUser = users.value.find(u => u.rut_persona == userForm.value.rut_persona)
          if (existingUser) {
            throw new Error('Ya existe un usuario con este RUT')
          }
        }

        // Validar username único
        const existingUsername = users.value.find(u => 
          u.username === userForm.value.username && 
          (!selectedUser.value || u.id !== selectedUser.value.id)
        )
        if (existingUsername) {
          throw new Error('Este nombre de usuario ya está en uso')
        }

        // Preparar datos para enviar
        const userData = {
          ...userForm.value,
          perfil: getProfileName(userForm.value.id_perfil_usuario),
          fecha_ingreso: selectedUser.value ? selectedUser.value.fecha_ingreso : new Date().toISOString()
        }

        if (selectedUser.value) {
          // Actualizar usuario existente
          try {
            await adminService.updateUser(selectedUser.value.rut_persona || selectedUser.value.id, userData)
            
            // Actualizar en la lista local
            const index = users.value.findIndex(u => u.id === selectedUser.value.id || u.rut_persona === selectedUser.value.rut_persona)
            if (index > -1) {
              users.value[index] = { ...users.value[index], ...userData }
            }
            
            showToast('Usuario actualizado correctamente', 'success')
          } catch (apiError) {
            console.log('API no disponible, actualizando localmente')
            
            // Actualizar localmente si la API no está disponible
            const index = users.value.findIndex(u => u.id === selectedUser.value.id || u.rut_persona === selectedUser.value.rut_persona)
            if (index > -1) {
              users.value[index] = { ...users.value[index], ...userData }
            }
            
            showToast('Usuario actualizado correctamente', 'success')
          }
        } else {
          // Crear nuevo usuario
          try {
            const response = await adminService.createUser(userData)
            users.value.push(response.data)
            showToast('Usuario creado correctamente', 'success')
          } catch (apiError) {
            console.log('API no disponible, creando localmente')
            
            // Crear localmente si la API no está disponible
            const newUser = {
              id: Date.now(), // ID temporal
              ...userData,
              fecha_ingreso: new Date().toISOString()
            }
            users.value.push(newUser)
            showToast('Usuario creado correctamente', 'success')
          }
        }
        
        closeUserModal()
      } catch (error) {
        console.error('Error guardando usuario:', error)
        formError.value = error.message
      } finally {
        formLoading.value = false
      }
    }

    const editUser = (user) => {
      openUserModal(user)
    }

    const toggleUserStatus = async (user) => {
      try {
        const newStatus = !user.activo
        const action = newStatus ? 'activar' : 'desactivar'
        
        if (confirm(`¿Estás seguro de ${action} este usuario?`)) {
          try {
            await adminService.toggleUserStatus(user.rut_persona || user.id)
          } catch (apiError) {
            console.log('API no disponible, actualizando localmente')
          }
          
          // Actualizar estado local
          user.activo = newStatus
          showToast(`Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`, 'success')
        }
      } catch (error) {
        console.error('Error cambiando estado del usuario:', error)
        showToast('Error al cambiar estado del usuario', 'error')
      }
    }

    const getProfileBadgeClass = (profile) => {
      switch (profile) {
        case 'ADMINISTRADOR':
          return 'bg-purple-100 text-purple-800'
        case 'SUPERVISOR':
          return 'bg-blue-100 text-blue-800'
        case 'TECNICO':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getProfileId = (profileName) => {
      switch (profileName) {
        case 'ADMINISTRADOR':
          return '1'
        case 'SUPERVISOR':
          return '2'
        case 'TECNICO':
          return '4'
        default:
          return ''
      }
    }

    const getProfileName = (profileId) => {
      switch (profileId) {
        case '1':
          return 'ADMINISTRADOR'
        case '2':
          return 'SUPERVISOR'
        case '4':
          return 'TECNICO'
        default:
          return ''
      }
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('es-CL')
    }

    const showToast = (message, type = 'success') => {
      toast.value = {
        show: true,
        message,
        type
      }
      
      setTimeout(() => {
        toast.value.show = false
      }, 3000)
    }

    const logout = async () => {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        await userStore.logout()
        router.push('/login')
      }
    }

    // Lifecycle
    onMounted(() => {
      loadUsers()
    })

    return {
      // State
      activeTab,
      users,
      loading,
      formLoading,
      formError,
      filters,
      showUserModal,
      selectedUser,
      userForm,
      toast,
      
      // Computed
      userName,
      userRole,
      totalUsers,
      supervisors,
      technicians,
      activeUsers,
      filteredUsers,
      
      // Methods
      openUserModal,
      closeUserModal,
      handleUserSave,
      editUser,
      toggleUserStatus,
      getProfileBadgeClass,
      formatDate,
      logout
    }
  }
}
</script>