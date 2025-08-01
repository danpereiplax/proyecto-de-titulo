<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <!-- Logo genérico con SVG -->
              <div class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p class="text-sm text-gray-500">Sistema GAET - Gestión de Usuarios</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Información del usuario -->
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ userStore.userName }}</p>
              <p class="text-xs text-gray-500">{{ userStore.userRole }}</p>
            </div>
            
            <!-- Menú de usuario -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                  <span class="text-sm font-medium text-white">
                    {{ userStore.userName.split(' ').map(n => n[0]).join('').toUpperCase() }}
                  </span>
                </div>
              </button>
              
              <!-- Dropdown menu -->
              <div v-if="showUserMenu" class="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div class="py-1">
                  <button 
                    @click="openChangePassword"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z"></path>
                    </svg>
                    Cambiar Contraseña
                  </button>
                  <button 
                    @click="logout"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación por tabs -->
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px space-x-8">
          <button
            @click="activeTab = 'dashboard'"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Dashboard
          </button>
          <button
            @click="activeTab = 'users'"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Gestión de Usuarios
            <span class="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium ml-2">
              {{ filteredUsers.length }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      <!-- Tab: Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Total Usuarios -->
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                    <dd class="text-3xl font-bold text-gray-900">{{ statistics.totalUsers || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Usuarios Activos -->
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
                    <dd class="text-3xl font-bold text-gray-900">{{ statistics.activeUsers || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Nuevos este mes -->
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Nuevos este mes</dt>
                    <dd class="text-3xl font-bold text-gray-900">{{ statistics.newUsersThisMonth || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="p-6 border border-blue-200 rounded-lg bg-blue-50">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Panel de Administrador
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>
                  Como administrador, tu función principal es gestionar usuarios del sistema. 
                  La gestión operativa (tareas, clientes, reportes) está disponible en el panel de supervisor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Gestión de Usuarios -->
      <div v-if="activeTab === 'users'" class="bg-white rounded-lg shadow">
        <div class="px-4 py-5 sm:p-6">
          <!-- Header de la tabla -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Gestión de Usuarios</h3>
              <p class="mt-1 text-sm text-gray-500">
                Administra los usuarios del sistema GAET
              </p>
            </div>
            
            <button 
              @click="openCreateUser"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Crear Usuario
            </button>
          </div>

          <!-- Filtros -->
          <div class="flex flex-col gap-4 mb-4 sm:flex-row">
            <div class="flex-1">
              <input 
                v-model="searchTerm"
                type="text"
                placeholder="Buscar por nombre, RUT o email..."
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div class="sm:w-48">
              <select 
                v-model="filterRole"
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos los roles</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="TECNICO">Técnico</option>
              </select>
            </div>
            <div class="sm:w-32">
              <select 
                v-model="filterStatus"
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="py-12 text-center">
            <svg class="w-8 h-8 mx-auto mr-3 -ml-1 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2 text-gray-500">Cargando usuarios...</p>
          </div>

          <!-- Tabla de usuarios -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    RUT
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Rol
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Contraseña
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.rut_persona" class="hover:bg-gray-50">
                  <!-- Usuario -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        <div class="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                          <span class="text-sm font-medium text-gray-700">
                            {{ `${user.nombre_persona[0]}${user.apellido_paterno_persona[0]}`.toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.nombre_persona }} {{ user.apellido_paterno_persona }}
                        </div>
                        <div class="text-sm text-gray-500">{{ user.email_corporativo }}</div>
                        <div class="text-xs text-gray-400">@{{ user.username }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- RUT -->
                  <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {{ formatRut(user.rut_persona, user.rut_dv_persona) }}
                  </td>

                  <!-- Rol -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleClass(user.descripcion_perfil_usuario)"
                    >
                      {{ user.descripcion_perfil_usuario }}
                    </span>
                  </td>

                  <!-- Estado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>

                  <!-- Estado de Contraseña -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-1">
                      <span 
                        v-if="user.password_hash"
                        class="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full"
                      >
                        Configurada
                      </span>
                      <span 
                        v-else
                        class="inline-flex px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full"
                      >
                        Pendiente
                      </span>
                      <span 
                        v-if="user.requiere_cambio_password"
                        class="inline-flex px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full"
                        title="Requiere cambio de contraseña"
                      >
                        ⚠️
                      </span>
                    </div>
                  </td>

                  <!-- Acciones -->
                  <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div class="flex justify-end space-x-2">
                      <!-- Editar -->
                      <button 
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Editar usuario"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>

                      <!-- Establecer/Cambiar Contraseña -->
                      <button 
                        @click="setUserPassword(user)"
                        class="text-purple-600 hover:text-purple-900"
                        title="Establecer contraseña"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z"></path>
                        </svg>
                      </button>

                      <!-- Activar/Desactivar -->
                      <button 
                        @click="toggleUserStatus(user)"
                        :class="user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        :title="user.activo ? 'Desactivar usuario' : 'Activar usuario'"
                      >
                        <svg v-if="user.activo" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje si no hay usuarios -->
          <div v-if="!loading && filteredUsers.length === 0" class="py-12 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchTerm || filterRole || filterStatus ? 'Intenta modificar los filtros de búsqueda.' : 'Comienza creando un nuevo usuario.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <ModalUsuario
      :mostrar-modal="showUserModal"
      :modo="userModalMode"
      :usuario="selectedUser"
      @cerrar="closeUserModal"
      @guardar="handleUserSave"
      ref="modalUsuario"
    />

    <ModalCambioContrasena
      :mostrar-modal="showChangePasswordModal"
      :es-requerido="passwordChangeRequired"
      @cerrar="closeChangePasswordModal"
      @contrasena-cambiada="handlePasswordChange"
    />

    <!-- Toast Notifications -->
    <div v-if="notifications.length > 0" class="fixed z-50 space-y-2 bottom-4 right-4">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="w-full max-w-sm rounded-lg shadow-lg pointer-events-auto"
        :class="getNotificationClass(notification.type)"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg v-if="notification.type === 'success'" class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else-if="notification.type === 'error'" class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <svg v-else class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium" :class="notification.type === 'success' ? 'text-green-900' : notification.type === 'error' ? 'text-red-900' : 'text-blue-900'">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm" :class="notification.type === 'success' ? 'text-green-700' : notification.type === 'error' ? 'text-red-700' : 'text-blue-700'">
                {{ notification.message }}
              </p>
            </div>
            <div class="flex flex-shrink-0 ml-4">
              <button 
                @click="removeNotification(notification.id)"
                class="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import ModalUsuario from '@/components/ModalUsuario.vue'
import ModalCambioContrasena from '@/components/ModalCambioContrasena.vue'
import apiClient from '@/utils/apiClient'
import adminService from '@/services/adminService'

export default {
  name: 'AdministradorView',
  components: {
    ModalUsuario,
    ModalCambioContrasena
  },
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      // Estado general
      loading: false,
      showUserMenu: false,
      activeTab: 'dashboard',
      
      // Datos
      users: [],
      statistics: {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0
      },
      
      // Filtros
      searchTerm: '',
      filterRole: '',
      filterStatus: '',
      
      // Modales
      showUserModal: false,
      userModalMode: 'crear',  // ✅ Valor por defecto en español
      selectedUser: null,
      showChangePasswordModal: false,
      passwordChangeRequired: false,
      
      // Notificaciones
      notifications: []
    }
  },
  computed: {
    filteredUsers() {
      let filtered = [...this.users];
      
      // Filtrar por término de búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(user => 
          user.nombre_persona.toLowerCase().includes(term) ||
          user.apellido_paterno_persona.toLowerCase().includes(term) ||
          user.email_corporativo.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term) ||
          this.formatRut(user.rut_persona, user.rut_dv_persona).includes(term)
        );
      }
      
      // Filtrar por rol
      if (this.filterRole) {
        filtered = filtered.filter(user => user.descripcion_perfil_usuario === this.filterRole);
      }
      
      // Filtrar por estado
      if (this.filterStatus !== '') {
        const isActive = this.filterStatus === 'true';
        filtered = filtered.filter(user => user.activo === isActive);
      }
      
      return filtered;
    }
  },
  async mounted() {
    // Verificar autenticación
    if (!this.userStore.isAuthenticated) {
      this.$router.push('/login');
      return;
    }
    
    // Verificar permisos de administrador
    if (!this.userStore.isAdmin) {
      this.showNotification('error', 'Acceso Denegado', 'No tienes permisos para acceder a esta sección');
      this.$router.push('/login');
      return;
    }
    
    await this.loadUsers();
    await this.loadStatistics();
    
    // Verificar si el usuario actual requiere cambio de contraseña
    await this.checkPasswordStatus();
  },
  methods: {
    // === GESTIÓN DE USUARIOS ===
    async loadUsers() {
      try {
        this.loading = true;
        console.log('🔄 Cargando usuarios desde la API...');
        
        const response = await adminService.getAllUsers();
        this.users = response.data || [];
        
        console.log(`✅ ${this.users.length} usuarios cargados desde la API`);
      } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        this.showNotification('error', 'Error', 'No se pudieron cargar los usuarios desde la API');
        // Fallback: cargar datos locales si existe
        this.loadLocalFallback();
      } finally {
        this.loading = false;
      }
    },
    
    loadLocalFallback() {
      // Cargar datos locales como fallback
      const savedUser = localStorage.getItem('gaet_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.users = [{
          rut_persona: user.rut?.split('-')[0] || '12345678',
          rut_dv_persona: user.rut?.split('-')[1] || '9',
          nombre_persona: user.nombre || 'Administrador',
          apellido_paterno_persona: user.apellido || 'Sistema',
          email_corporativo: user.email || 'admin@infomaxis.cl',
          descripcion_perfil_usuario: user.perfil || 'ADMINISTRADOR',
          activo: true,
          username: user.username || 'admin',
          password_hash: '***',
          requiere_cambio_password: false
        }];
        console.log('📝 Datos locales cargados como fallback');
      }
    },
    
    async loadStatistics() {
      try {
        console.log('📊 Cargando estadísticas...');
        const response = await adminService.getStats();
        this.statistics = response.data;
        console.log('✅ Estadísticas cargadas:', this.statistics);
      } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        // Calcular estadísticas localmente como fallback
        this.calculateLocalStatistics();
      }
    },
    
    calculateLocalStatistics() {
      this.statistics.totalUsers = this.users.length;
      this.statistics.activeUsers = this.users.filter(u => u.activo).length;
      
      // Usuarios nuevos este mes
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      this.statistics.newUsersThisMonth = this.users.filter(u => {
        if (!u.fecha_ingreso) return false;
        const userDate = new Date(u.fecha_ingreso);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length;
      
      console.log('📊 Estadísticas calculadas localmente:', this.statistics);
    },

    async checkPasswordStatus() {
      try {
        const response = await apiClient.get('/api/password/check-password-status');
        if (response.data.requiresPasswordChange) {
          this.passwordChangeRequired = true;
          this.showChangePasswordModal = true;
          this.showNotification('warning', 'Cambio de Contraseña Requerido', 'Debes cambiar tu contraseña temporal');
        }
      } catch (error) {
        console.error('Error verificando estado de contraseña:', error);
        // No mostrar error si no hay endpoint de contraseñas implementado
      }
    },
    
    // === ACCIONES DE USUARIOS ===
    openCreateUser() {
      console.log('🔧 Abriendo modal para crear usuario');
      this.selectedUser = null;
      this.userModalMode = 'crear';  // ✅ Cambiado de 'create' a 'crear'
      this.showUserModal = true;
      console.log('✅ Modal configurado - modo:', this.userModalMode);
    },
    
    editUser(user) {
      console.log('✏️ Abriendo modal para editar usuario:', user.nombre_persona);
      this.selectedUser = { ...user };
      this.userModalMode = 'editar';  // ✅ Cambiado de 'edit' a 'editar'
      this.showUserModal = true;
      console.log('✅ Modal configurado - modo:', this.userModalMode);
    },
    
    closeUserModal() {
      this.showUserModal = false;
      this.selectedUser = null;
    },
    
    async handleUserSave(event) {
      try {
        const { modo, datos, opcionContrasena } = event;
        
        console.log('💾 Guardando usuario:', { modo, datos: datos.nombre_persona, opcionContrasena });
        
        if (modo === 'crear') {  // ✅ Usando 'crear' en lugar de 'create'
          await this.createUser(datos, opcionContrasena);
        } else if (modo === 'editar') {  // ✅ Usando 'editar' en lugar de 'edit'
          await this.updateUser(datos);
        }
        
        this.closeUserModal();
        await this.loadUsers();
        await this.loadStatistics();
        
      } catch (error) {
        console.error('❌ Error guardando usuario:', error);
        this.showNotification('error', 'Error', error.message || 'Error al guardar el usuario');
      }
    },
    
    async createUser(userData, passwordOption) {
      try {
        console.log('➕ Creando usuario:', userData.nombre_persona, 'con opción de contraseña:', passwordOption);
        
        // Validaciones locales
        if (!this.validateUserData(userData)) {
          return;
        }
        
        // Crear usuario en la API
        const response = await adminService.createUser(userData);
        console.log('✅ Usuario creado en la API:', response.data);
        
        // Si es contraseña automática, generar después de crear
        if (passwordOption === 'auto') {
          try {
            const passwordResponse = await adminService.generateTemporaryPassword(response.data.rut_persona);
            
            this.showNotification('success', 'Usuario Creado', 
              `Usuario creado con contraseña temporal: ${passwordResponse.temporaryPassword}`);
            
            // Mostrar modal con contraseña generada
            this.$refs.modalUsuario?.mostrarContrasenaGeneradaModal(passwordResponse.temporaryPassword);
            
          } catch (passwordError) {
            console.warn('⚠️ Usuario creado pero falló la generación de contraseña:', passwordError);
            this.showNotification('warning', 'Usuario Creado', 
              'Usuario creado exitosamente. Configure la contraseña manualmente.');
          }
        } else if (userData.password) {
          // Establecer contraseña manual
          try {
            await adminService.setUserPassword(
              response.data.rut_persona, 
              userData.password, 
              userData.requirePasswordChange
            );
            this.showNotification('success', 'Usuario Creado', 'Usuario creado con contraseña establecida');
          } catch (passwordError) {
            console.warn('⚠️ Usuario creado pero falló establecer contraseña:', passwordError);
            this.showNotification('warning', 'Usuario Creado', 
              'Usuario creado. Configure la contraseña manualmente.');
          }
        } else {
          this.showNotification('success', 'Usuario Creado', 'Usuario creado exitosamente');
        }
        
      } catch (error) {
        console.error('❌ Error creando usuario:', error);
        throw new Error(error.message || 'Error al crear el usuario');
      }
    },
    
    async updateUser(userData) {
      try {
        console.log('✏️ Actualizando usuario:', userData.rut_persona);
        
        const response = await adminService.updateUser(userData.rut_persona, userData);
        console.log('✅ Usuario actualizado:', response.data);
        
        this.showNotification('success', 'Usuario Actualizado', 'Los datos del usuario se actualizaron correctamente');
      } catch (error) {
        console.error('❌ Error actualizando usuario:', error);
        throw new Error(error.message || 'Error al actualizar el usuario');
      }
    },
    
    async setUserPassword(user) {
      try {
        const password = prompt(`Establecer contraseña para ${user.nombre_persona} ${user.apellido_paterno_persona}:`);
        if (!password) return;
        
        if (password.length < 6) {
          this.showNotification('error', 'Error', 'La contraseña debe tener al menos 6 caracteres');
          return;
        }
        
        console.log('🔐 Estableciendo contraseña para:', user.nombre_persona);
        
        const response = await adminService.setUserPassword(user.rut_persona, password, true);
        console.log('✅ Contraseña establecida:', response);
        
        this.showNotification('success', 'Contraseña Establecida', `Contraseña configurada para ${user.nombre_persona}`);
        await this.loadUsers();
        
      } catch (error) {
        console.error('❌ Error estableciendo contraseña:', error);
        this.showNotification('error', 'Error', error.message || 'Error al establecer la contraseña');
      }
    },
    
    async toggleUserStatus(user) {
      try {
        const action = user.activo ? 'desactivar' : 'activar';
        const confirmed = confirm(`¿Estás seguro de que deseas ${action} a ${user.nombre_persona} ${user.apellido_paterno_persona}?`);
        
        if (!confirmed) return;
        
        console.log(`🔄 ${action}ando usuario:`, user.nombre_persona);
        
        const response = await adminService.toggleUserStatus(user.rut_persona, user.activo);
        console.log(`✅ Usuario ${action}ado:`, response);
        
        this.showNotification('success', 'Estado Actualizado', `Usuario ${action}ado correctamente`);
        await this.loadUsers();
        await this.loadStatistics();
        
      } catch (error) {
        console.error('❌ Error cambiando estado del usuario:', error);
        this.showNotification('error', 'Error', error.message || 'No se pudo cambiar el estado del usuario');
      }
    },
    
    // === VALIDACIONES ===
    validateUserData(userData) {
      // Validar RUT
      if (!adminService.validateRut(userData.rut_persona, userData.rut_dv_persona)) {
        this.showNotification('error', 'RUT Inválido', 'El RUT ingresado no es válido');
        return false;
      }
      
      // Validar email
      if (!adminService.validateEmail(userData.email_corporativo)) {
        this.showNotification('error', 'Email Inválido', 'El email corporativo no es válido');
        return false;
      }
      
      // Validar contraseña si se proporciona
      if (userData.password && userData.password.length < 6) {
        this.showNotification('error', 'Contraseña Inválida', 'La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      
      return true;
    },
    
    // === GESTIÓN DE CONTRASEÑAS ===
    openChangePassword() {
      this.passwordChangeRequired = false;
      this.showChangePasswordModal = true;
      this.showUserMenu = false;
    },
    
    closeChangePasswordModal() {
      if (!this.passwordChangeRequired) {
        this.showChangePasswordModal = false;
      }
    },
    
    async handlePasswordChange(passwordData) {
      try {
        await apiClient.post('/api/auth/change-password', passwordData);
        
        this.showNotification('success', 'Contraseña Actualizada', 'Tu contraseña se ha actualizado correctamente');
        this.showChangePasswordModal = false;
        this.passwordChangeRequired = false;
        
      } catch (error) {
        console.error('Error cambiando contraseña:', error);
        this.showNotification('error', 'Error', error.response?.data?.error || 'Error al cambiar la contraseña');
      }
    },
    
    // === UTILIDADES ===
    formatRut(rut, dv) {
      if (!rut || !dv) return '';
      return `${rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
    },
    
    getRoleClass(role) {
      switch (role) {
        case 'ADMINISTRADOR':
          return 'bg-red-100 text-red-800';
        case 'SUPERVISOR':
          return 'bg-blue-100 text-blue-800';
        case 'TECNICO':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    
    // === NOTIFICACIONES ===
    showNotification(type, title, message = '') {
      const notification = {
        id: Date.now() + Math.random(),
        type,
        title,
        message
      };
      
      this.notifications.push(notification);
      
      // Auto-remover después de 5 segundos
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    },
    
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },
    
    getNotificationClass(type) {
      switch (type) {
        case 'success':
          return 'bg-green-50 border border-green-200';
        case 'error':
          return 'bg-red-50 border border-red-200';
        case 'warning':
          return 'bg-yellow-50 border border-yellow-200';
        default:
          return 'bg-blue-50 border border-blue-200';
      }
    },
    
    // === AUTENTICACIÓN ===
    async logout() {
      try {
        await this.userStore.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Error durante logout:', error);
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>