<!-- frontend/src/views/AdminView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">GAET - Panel de Administración</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Bienvenido, {{ userStore.user?.nombre || 'Administrador' }}</span>
            <button @click="logout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <i class="fas fa-sign-out-alt mr-2"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Cargando...</p>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="px-4 py-6 sm:px-0">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="stat in stats" :key="stat.name" class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i :class="[stat.icon, stat.color]" class="text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stat.value }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Actividad Reciente del Sistema</h3>
            <div class="flow-root">
              <ul class="-my-5 divide-y divide-gray-200">
                <li v-for="activity in recentActivity" :key="activity.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <span :class="[
                        'inline-flex items-center justify-center h-8 w-8 rounded-full',
                        getActivityColor(activity.type)
                      ]">
                        <i :class="getActivityIcon(activity.type)"></i>
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ activity.description }}</p>
                      <p class="text-sm text-gray-500">{{ formatDate(activity.fecha_creacion) }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestión de Usuarios -->
      <div v-else-if="activeTab === 'users'" class="px-4 py-6 sm:px-0">
        <div class="sm:flex sm:items-center mb-6">
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
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Buscar por nombre</label>
              <input v-model="filters.search" type="text" placeholder="Nombre o RUT" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Filtrar por perfil</label>
              <select v-model="filters.perfil" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Todos los perfiles</option>
                <option value="Administrador">Administrador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Técnico">Técnico</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <select v-model="filters.activo" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
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
              <tr v-for="user in filteredUsers" :key="user.rut_persona" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span class="text-white font-medium text-sm">
                          {{ user.nombre_persona?.charAt(0) }}{{ user.apellido_paterno_persona?.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.nombre_persona }} {{ user.apellido_paterno_persona }}
                      </div>
                      <div class="text-sm text-gray-500">{{ formatRut(user.rut_persona, user.rut_dv_persona) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email_corporativo || user.email_pesonal }}</div>
                  <div class="text-sm text-gray-500">{{ user.telefono || 'Sin teléfono' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getPerfilColor(user.descripcion_perfil_usuario)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ user.descripcion_perfil_usuario }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.fecha_ingreso) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openUserModal(user)" class="text-blue-600 hover:text-blue-900 mr-3 transition-colors">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="toggleUserStatus(user)" 
                          :class="user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                          class="transition-colors">
                    <i :class="user.activo ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredUsers.length === 0" class="text-center py-8">
            <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-500">No se encontraron usuarios con los filtros aplicados</p>
          </div>
        </div>
      </div>

      <!-- Configuración del Sistema -->
      <div v-else-if="activeTab === 'config'" class="px-4 py-6 sm:px-0">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Configuración del Sistema</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Tipos de Tarea -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Tipos de Tarea</h3>
              <div class="flex mb-4">
                <input v-model="newTipoTarea" @keyup.enter="addTipoTarea" type="text" placeholder="Nuevo tipo de tarea" 
                       class="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <button @click="addTipoTarea" :disabled="!newTipoTarea.trim()" 
                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <ul class="divide-y divide-gray-200">
                  <li v-for="tipo in tiposTarea" :key="tipo.id_tipo_tarea" class="py-3 flex justify-between items-center">
                    <span class="text-sm text-gray-900">{{ tipo.descripcion_tipo_tarea }}</span>
                    <button @click="deleteTipoTarea(tipo.id_tipo_tarea)" class="text-red-600 hover:text-red-900 transition-colors">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Estados de Tarea -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Estados de Tarea</h3>
              <div class="flex mb-4">
                <input v-model="newEstadoTarea" @keyup.enter="addEstadoTarea" type="text" placeholder="Nuevo estado" 
                       class="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <button @click="addEstadoTarea" :disabled="!newEstadoTarea.trim()" 
                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <ul class="divide-y divide-gray-200">
                  <li v-for="estado in estadosTarea" :key="estado.id_estado_tarea" class="py-3 flex justify-between items-center">
                    <span class="text-sm text-gray-900">{{ estado.descripcion_estado_tarea }}</span>
                    <button @click="deleteEstadoTarea(estado.id_estado_tarea)" class="text-red-600 hover:text-red-900 transition-colors">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Áreas de Cobro -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Áreas de Cobro</h3>
              <div class="flex mb-4">
                <input v-model="newAreaCobro" @keyup.enter="addAreaCobro" type="text" placeholder="Nueva área de cobro" 
                       class="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <button @click="addAreaCobro" :disabled="!newAreaCobro.trim()" 
                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <ul class="divide-y divide-gray-200">
                  <li v-for="area in areasCobro" :key="area.id_area_cobro" class="py-3 flex justify-between items-center">
                    <span class="text-sm text-gray-900">{{ area.descripcion_area_cobro }}</span>
                    <button @click="deleteAreaCobro(area.id_area_cobro)" class="text-red-600 hover:text-red-900 transition-colors">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Gestión de Clientes -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Gestión de Clientes</h3>
              <button @click="openClientModal()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mb-4 transition-colors">
                <i class="fas fa-building mr-2"></i>
                Agregar Cliente
              </button>
              <div class="max-h-48 overflow-y-auto">
                <ul class="divide-y divide-gray-200">
                  <li v-for="client in clients" :key="client.rut_cliente" class="py-3 flex justify-between items-center">
                    <div>
                      <span class="text-sm font-medium text-gray-900">{{ client.descripcion_cliente }}</span>
                      <p class="text-xs text-gray-500">{{ formatRut(client.rut_cliente, client.rut_dv_cliente) }}</p>
                    </div>
                    <button @click="openClientModal(client)" class="text-blue-600 hover:text-blue-900 transition-colors">
                      <i class="fas fa-edit"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes -->
      <div v-else-if="activeTab === 'reports'" class="px-4 py-6 sm:px-0">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Reportes del Sistema</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="report in reports" :key="report.id" 
               class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
               @click="generateReport(report.id)">
            <div class="flex items-center mb-4">
              <i :class="report.icon" class="text-3xl text-blue-600 mr-4"></i>
              <div>
                <h4 class="text-lg font-medium text-gray-900">{{ report.name }}</h4>
                <p class="text-sm text-gray-500">{{ report.description }}</p>
              </div>
            </div>
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <i class="fas fa-download mr-2"></i>
              Generar Reporte
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Usuario -->
    <div v-if="showUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ selectedUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">RUT *</label>
              <input v-model="userForm.rut_persona" type="text" required 
                     :disabled="!!selectedUser"
                     placeholder="12345678"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100">
              <small class="text-gray-500">Sin puntos ni guión</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dígito Verificador *</label>
              <input v-model="userForm.rut_dv_persona" type="text" required maxlength="1"
                     :disabled="!!selectedUser"
                     placeholder="9 o K"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                <input v-model="userForm.nombre_persona" type="text" required 
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Apellido Paterno *</label>
                <input v-model="userForm.apellido_paterno_persona" type="text" required 
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Materno</label>
              <input v-model="userForm.apellido_materno_persona" type="text" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Corporativo *</label>
              <input v-model="userForm.email_corporativo" type="email" required 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Personal</label>
              <input v-model="userForm.email_pesonal" type="email" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input v-model="userForm.telefono" type="tel" 
                     placeholder="+56912345678"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Perfil *</label>
              <select v-model="userForm.id_perfil_usuario" required 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Seleccionar perfil</option>
                <option v-for="perfil in perfiles" :key="perfil.id_perfil_usuario" :value="perfil.id_perfil_usuario">
                  {{ perfil.descripcion_perfil_usuario }}
                </option>
              </select>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeUserModal" 
                      class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors">
                Cancelar
              </button>
              <button type="submit" :disabled="loading"
                      class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors">
                {{ loading ? 'Guardando...' : (selectedUser ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" :class="[
      'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm',
      toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    ]">
      <div class="flex items-center">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
        <p>{{ toast.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { adminService } from '@/services/adminService'

export default {
  name: 'AdminView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const activeTab = ref('dashboard')
    const loading = ref(false)
    const showUserModal = ref(false)
    const selectedUser = ref(null)
    
    // Data
    const users = ref([])
    const perfiles = ref([])
    const tiposTarea = ref([])
    const estadosTarea = ref([])
    const areasCobro = ref([])
    const clients = ref([])
    const stats = ref([])
    const recentActivity = ref([])
    
    // Form inputs
    const newTipoTarea = ref('')
    const newEstadoTarea = ref('')
    const newAreaCobro = ref('')
    
    // Toast notifications
    const toast = reactive({
      show: false,
      message: '',
      type: 'success'
    })
    
    // Filters
    const filters = reactive({
      search: '',
      perfil: '',
      activo: ''
    })
    
    const tabs = [
      { key: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-bar' },
      { key: 'users', name: 'Usuarios', icon: 'fas fa-users' },
      { key: 'config', name: 'Configuración', icon: 'fas fa-cog' },
      { key: 'reports', name: 'Reportes', icon: 'fas fa-file-alt' }
    ]

    const reports = [
      { id: 1, name: 'Tareas por Técnico', description: 'Resumen de tareas realizadas por cada técnico', icon: 'fas fa-user-chart' },
      { id: 2, name: 'Productividad Mensual', description: 'Análisis de productividad del último mes', icon: 'fas fa-chart-line' },
      { id: 3, name: 'Estado de Tareas', description: 'Distribución de tareas por estado', icon: 'fas fa-chart-pie' },
      { id: 4, name: 'Reporte de Usuarios', description: 'Lista completa de usuarios del sistema', icon: 'fas fa-users' }
    ]

    const userForm = reactive({
      rut_persona: '',
      rut_dv_persona: '',
      nombre_persona: '',
      apellido_paterno_persona: '',
      apellido_materno_persona: '',
      email_corporativo: '',
      email_pesonal: '',
      telefono: '',
      id_perfil_usuario: ''
    })

    // Computed properties
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = !filters.search || 
          user.nombre_persona?.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.apellido_paterno_persona?.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.rut_persona?.toString().includes(filters.search)
        
        const matchesPerfil = !filters.perfil || user.descripcion_perfil_usuario === filters.perfil
        
        const matchesActivo = filters.activo === '' || user.activo.toString() === filters.activo
        
        return matchesSearch && matchesPerfil && matchesActivo
      })
    })

    // Methods
    const showToast = (message, type = 'success') => {
      toast.message = message
      toast.type = type
      toast.show = true
      setTimeout(() => {
        toast.show = false
      }, 3000)
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CL')
    }

    const formatRut = (rut, dv) => {
      if (!rut) return '-'
      const rutStr = rut.toString()
      return `${rutStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`
    }

    const getPerfilColor = (perfil) => {
      const colors = {
        'Administrador': 'bg-purple-100 text-purple-800',
        'Supervisor': 'bg-blue-100 text-blue-800',
        'Técnico': 'bg-green-100 text-green-800'
      }
      return colors[perfil] || 'bg-gray-100 text-gray-800'
    }

    const getActivityColor = (type) => {
      const colors = {
        'user': 'bg-blue-100',
        'task': 'bg-green-100',
        'client': 'bg-yellow-100',
        'system': 'bg-purple-100'
      }
      return colors[type] || 'bg-gray-100'
    }

    const getActivityIcon = (type) => {
      const icons = {
        'user': 'fas fa-user text-blue-600',
        'task': 'fas fa-tasks text-green-600',
        'client': 'fas fa-building text-yellow-600',
        'system': 'fas fa-cog text-purple-600'
      }
      return icons[type] || 'fas fa-info text-gray-600'
    }

    // API Methods
    const loadDashboardData = async () => {
      try {
        loading.value = true
        const [statsData, activityData] = await Promise.all([
          adminService.getStats(),
          adminService.getRecentActivity()
        ])
        
        stats.value = [
          { name: 'Total Usuarios', value: statsData.totalUsuarios || 0, icon: 'fas fa-users', color: 'text-blue-600' },
          { name: 'Tareas Activas', value: statsData.tareasActivas || 0, icon: 'fas fa-tasks', color: 'text-green-600' },
          { name: 'Clientes', value: statsData.totalClientes || 0, icon: 'fas fa-building', color: 'text-yellow-600' },
          { name: 'Técnicos Activos', value: statsData.tecnicosActivos || 0, icon: 'fas fa-user-hard-hat', color: 'text-purple-600' }
        ]
        
        recentActivity.value = activityData
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        showToast('Error al cargar datos del dashboard', 'error')
      } finally {
        loading.value = false
      }
    }

    const loadUsers = async () => {
      try {
        loading.value = true
        const data = await adminService.getUsers()
        users.value = data
      } catch (error) {
        console.error('Error loading users:', error)
        showToast('Error al cargar usuarios', 'error')
      } finally {
        loading.value = false
      }
    }

    const loadPerfiles = async () => {
      try {
        const data = await adminService.getPerfiles()
        perfiles.value = data
      } catch (error) {
        console.error('Error loading perfiles:', error)
      }
    }

    const loadConfigData = async () => {
      try {
        loading.value = true
        const [tipos, estados, areas, clientsData] = await Promise.all([
          adminService.getTiposTarea(),
          adminService.getEstadosTarea(),
          adminService.getAreasCobro(),
          adminService.getClients()
        ])
        
        tiposTarea.value = tipos
        estadosTarea.value = estados
        areasCobro.value = areas
        clients.value = clientsData
      } catch (error) {
        console.error('Error loading config data:', error)
        showToast('Error al cargar configuración', 'error')
      } finally {
        loading.value = false
      }
    }

    // User Management
    const openUserModal = (user = null) => {
      if (user) {
        selectedUser.value = user
        Object.assign(userForm, user)
      } else {
        selectedUser.value = null
        Object.assign(userForm, {
          rut_persona: '',
          rut_dv_persona: '',
          nombre_persona: '',
          apellido_paterno_persona: '',
          apellido_materno_persona: '',
          email_corporativo: '',
          email_pesonal: '',
          telefono: '',
          id_perfil_usuario: ''
        })
      }
      showUserModal.value = true
    }

    const closeUserModal = () => {
      showUserModal.value = false
      selectedUser.value = null
    }

    const saveUser = async () => {
      try {
        loading.value = true
        
        const userData = {
          ...userForm,
          rut_persona: parseInt(userForm.rut_persona),
          id_perfil_usuario: parseInt(userForm.id_perfil_usuario)
        }

        if (selectedUser.value) {
          await adminService.updateUser(selectedUser.value.rut_persona, userData)
          showToast('Usuario actualizado exitosamente')
        } else {
          await adminService.createUser(userData)
          showToast('Usuario creado exitosamente')
        }
        
        closeUserModal()
        await loadUsers()
      } catch (error) {
        console.error('Error saving user:', error)
        showToast(error.response?.data?.message || 'Error al guardar usuario', 'error')
      } finally {
        loading.value = false
      }
    }

    const toggleUserStatus = async (user) => {
      try {
        await adminService.toggleUserStatus(user.rut_persona, !user.activo)
        user.activo = !user.activo
        showToast(`Usuario ${user.activo ? 'activado' : 'desactivado'} exitosamente`)
      } catch (error) {
        console.error('Error toggling user status:', error)
        showToast('Error al cambiar estado del usuario', 'error')
      }
    }

    // Configuration Management
    const addTipoTarea = async () => {
      if (!newTipoTarea.value.trim()) return
      
      try {
        const newTipo = await adminService.createTipoTarea({ descripcion_tipo_tarea: newTipoTarea.value.trim() })
        tiposTarea.value.push(newTipo)
        newTipoTarea.value = ''
        showToast('Tipo de tarea agregado exitosamente')
      } catch (error) {
        console.error('Error adding tipo tarea:', error)
        showToast('Error al agregar tipo de tarea', 'error')
      }
    }

    const deleteTipoTarea = async (id) => {
      try {
        await adminService.deleteTipoTarea(id)
        tiposTarea.value = tiposTarea.value.filter(tipo => tipo.id_tipo_tarea !== id)
        showToast('Tipo de tarea eliminado exitosamente')
      } catch (error) {
        console.error('Error deleting tipo tarea:', error)
        showToast('Error al eliminar tipo de tarea', 'error')
      }
    }

    const addEstadoTarea = async () => {
      if (!newEstadoTarea.value.trim()) return
      
      try {
        const newEstado = await adminService.createEstadoTarea({ descripcion_estado_tarea: newEstadoTarea.value.trim() })
        estadosTarea.value.push(newEstado)
        newEstadoTarea.value = ''
        showToast('Estado de tarea agregado exitosamente')
      } catch (error) {
        console.error('Error adding estado tarea:', error)
        showToast('Error al agregar estado de tarea', 'error')
      }
    }

    const deleteEstadoTarea = async (id) => {
      try {
        await adminService.deleteEstadoTarea(id)
        estadosTarea.value = estadosTarea.value.filter(estado => estado.id_estado_tarea !== id)
        showToast('Estado de tarea eliminado exitosamente')
      } catch (error) {
        console.error('Error deleting estado tarea:', error)
        showToast('Error al eliminar estado de tarea', 'error')
      }
    }

    const addAreaCobro = async () => {
      if (!newAreaCobro.value.trim()) return
      
      try {
        const newArea = await adminService.createAreaCobro({ descripcion_area_cobro: newAreaCobro.value.trim() })
        areasCobro.value.push(newArea)
        newAreaCobro.value = ''
        showToast('Área de cobro agregada exitosamente')
      } catch (error) {
        console.error('Error adding area cobro:', error)
        showToast('Error al agregar área de cobro', 'error')
      }
    }

    const deleteAreaCobro = async (id) => {
      try {
        await adminService.deleteAreaCobro(id)
        areasCobro.value = areasCobro.value.filter(area => area.id_area_cobro !== id)
        showToast('Área de cobro eliminada exitosamente')
      } catch (error) {
        console.error('Error deleting area cobro:', error)
        showToast('Error al eliminar área de cobro', 'error')
      }
    }

    const openClientModal = (client = null) => {
      // TODO: Implementar modal de cliente
      console.log('Opening client modal:', client)
      showToast('Funcionalidad en desarrollo', 'error')
    }

    const generateReport = (reportId) => {
      // TODO: Implementar generación de reportes
      console.log('Generating report:', reportId)
      showToast('Funcionalidad en desarrollo', 'error')
    }

    const logout = () => {
      userStore.logout()
      router.push('/login')
    }

    // Watchers
    watch(activeTab, (newTab) => {
      switch (newTab) {
        case 'dashboard':
          loadDashboardData()
          break
        case 'users':
          loadUsers()
          break
        case 'config':
          loadConfigData()
          break
      }
    })

    // Lifecycle
    onMounted(async () => {
      await loadPerfiles()
      await loadDashboardData()
    })

    return {
      // State
      activeTab,
      loading,
      showUserModal,
      selectedUser,
      toast,
      
      // Data
      tabs,
      users,
      perfiles,
      tiposTarea,
      estadosTarea,
      areasCobro,
      clients,
      stats,
      recentActivity,
      reports,
      
      // Forms
      userForm,
      newTipoTarea,
      newEstadoTarea,
      newAreaCobro,
      filters,
      
      // Computed
      filteredUsers,
      
      // Store
      userStore,
      
      // Methods
      formatDate,
      formatRut,
      getPerfilColor,
      getActivityColor,
      getActivityIcon,
      openUserModal,
      closeUserModal,
      saveUser,
      toggleUserStatus,
      addTipoTarea,
      deleteTipoTarea,
      addEstadoTarea,
      deleteEstadoTarea,
      addAreaCobro,
      deleteAreaCobro,
      openClientModal,
      generateReport,
      logout
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>