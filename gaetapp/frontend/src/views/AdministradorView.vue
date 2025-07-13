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

        <!-- Users List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div v-if="loading" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">Cargando usuarios...</p>
          </div>
          
          <div v-else-if="users.length === 0" class="p-8 text-center">
            <i class="fas fa-users text-3xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">No hay usuarios registrados</p>
          </div>

          <ul v-else class="divide-y divide-gray-200">
            <li v-for="user in users" :key="user.rut_persona" class="px-6 py-4 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <i class="fas fa-user text-gray-500"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.nombre_persona }} {{ user.apellido_paterno_persona }}
                    </div>
                    <div class="text-sm text-gray-500">{{ user.email_corporativo }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="getProfileBadgeClass(user.perfil || user.descripcion_perfil_usuario)">
                    {{ user.perfil || user.descripcion_perfil_usuario }}
                  </span>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                  <div class="flex space-x-2">
                    <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="toggleUserStatus(user)" 
                            :class="user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                      <i :class="user.activo ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg text-white',
        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      ]">
        <div class="flex items-center">
          <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
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

export default {
  name: 'AdministradorView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const activeTab = ref('dashboard')
    const users = ref([])
    const loading = ref(false)
    
    // Toast
    const toast = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Computed
    const userName = computed(() => userStore.userName)
    const userRole = computed(() => userStore.userRole)
    
    const totalUsers = computed(() => users.value.length)
    const supervisors = computed(() => users.value.filter(u => (u.perfil || u.descripcion_perfil_usuario) === 'SUPERVISOR').length)
    const technicians = computed(() => users.value.filter(u => (u.perfil || u.descripcion_perfil_usuario) === 'TECNICO').length)
    const activeUsers = computed(() => users.value.filter(u => u.activo).length)

    // Methods
    const loadUsers = async () => {
      try {
        loading.value = true
        // Simulamos carga de usuarios desde localStorage por ahora
        const savedUser = localStorage.getItem('gaet_user')
        if (savedUser) {
          const user = JSON.parse(savedUser)
          users.value = [{
            rut_persona: user.rut?.split('-')[0] || '12345678',
            rut_dv_persona: user.rut?.split('-')[1] || '9',
            nombre_persona: user.nombre || 'Administrador',
            apellido_paterno_persona: user.apellido || 'Sistema',
            email_corporativo: user.email || 'admin@infomaxis.cl',
            perfil: user.perfil || 'ADMINISTRADOR',
            activo: true,
            username: user.username || 'admin'
          }]
        }
      } catch (error) {
        console.error('Error cargando usuarios:', error)
        showToast('Error al cargar usuarios', 'error')
      } finally {
        loading.value = false
      }
    }

    const openUserModal = () => {
      showToast('Funcionalidad de crear usuario próximamente', 'info')
    }

    const editUser = (user) => {
      showToast('Funcionalidad de editar usuario próximamente', 'info')
    }

    const toggleUserStatus = (user) => {
      user.activo = !user.activo
      showToast(`Usuario ${user.activo ? 'activado' : 'desactivado'} correctamente`, 'success')
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
      await userStore.logout()
      router.push('/login')
    }

    // Lifecycle
    onMounted(() => {
      loadUsers()
    })

    return {
      activeTab,
      users,
      loading,
      toast,
      userName,
      userRole,
      totalUsers,
      supervisors,
      technicians,
      activeUsers,
      openUserModal,
      editUser,
      toggleUserStatus,
      getProfileBadgeClass,
      logout
    }
  }
}
</script>