<!-- frontend/src/views/SupervisorView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Panel de Supervisión</h1>
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
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center'
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Dashboard Operativo -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Stats Cards Operativas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-tasks text-blue-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tareas Activas</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.activeTasks }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-clock text-yellow-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.pendingTasks }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Completadas Hoy</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.completedToday }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-users text-purple-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Técnicos Activos</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.activeTechnicians }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de Técnicos -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Estado de Técnicos</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="tech in technicians" :key="tech.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                      <i class="fas fa-user text-blue-600"></i>
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ tech.name }}</div>
                    <div class="text-sm text-gray-500">{{ tech.tasksAssigned }} tareas asignadas</div>
                  </div>
                  <div class="flex-shrink-0">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      tech.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ tech.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestión de Tareas -->
      <div v-else-if="activeTab === 'tasks'" class="space-y-6">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Tareas</h2>
            <p class="mt-2 text-sm text-gray-700">Crea, asigna y supervisa las tareas técnicas.</p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button @click="openTaskModal()" class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>
              Nueva Tarea
            </button>
          </div>
        </div>

        <!-- Filtros de Tareas -->
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <select v-model="taskFilters.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="">Todos los estados</option>
                <option value="ASIGNADA">Asignada</option>
                <option value="ENEJECUCION">En Ejecución</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Técnico</label>
              <select v-model="taskFilters.technician" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="">Todos los técnicos</option>
                <option v-for="tech in technicians" :key="tech.id" :value="tech.id">{{ tech.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cliente</label>
              <select v-model="taskFilters.client" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="">Todos los clientes</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <input v-model="taskFilters.date" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            </div>
          </div>
        </div>

        <!-- Lista de Tareas -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div v-if="loadingTasks" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">Cargando tareas...</p>
          </div>
          
          <div v-else-if="filteredTasks.length === 0" class="p-8 text-center">
            <i class="fas fa-clipboard-list text-3xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">No hay tareas registradas</p>
            <button @click="openTaskModal()" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
              Crear primera tarea
            </button>
          </div>

          <ul v-else class="divide-y divide-gray-200">
            <li v-for="task in filteredTasks" :key="task.id" class="px-6 py-4 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-medium text-gray-900">
                      {{ task.title }}
                    </div>
                    <div class="flex items-center space-x-2">
                      <span :class="getTaskStatusClass(task.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ task.status }}
                      </span>
                      <span class="text-xs text-gray-500">{{ task.priority }}</span>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <i class="fas fa-user mr-1"></i>
                    {{ task.technician }}
                    <i class="fas fa-building ml-4 mr-1"></i>
                    {{ task.client }}
                    <i class="fas fa-calendar ml-4 mr-1"></i>
                    {{ formatDate(task.date) }}
                  </div>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <button @click="viewTask(task)" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="editTask(task)" class="text-green-600 hover:text-green-900">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteTask(task)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Gestión de Clientes -->
      <div v-else-if="activeTab === 'clients'" class="space-y-6">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Clientes</h2>
            <p class="mt-2 text-sm text-gray-700">Administra los clientes y sus ubicaciones.</p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button @click="openClientModal()" class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>
              Nuevo Cliente
            </button>
          </div>
        </div>

        <!-- Lista de Clientes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="client in clients" :key="client.id" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i class="fas fa-building text-blue-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ client.name }}</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ client.rut }}</dd>
                  </dl>
                </div>
              </div>
              <div class="mt-5">
                <div class="text-sm text-gray-500">
                  <p>{{ client.locations }} ubicaciones</p>
                  <p>{{ client.activeTasks }} tareas activas</p>
                </div>
                <div class="mt-3 flex space-x-3">
                  <button @click="viewClient(client)" class="text-sm text-blue-600 hover:text-blue-900">
                    Ver detalles
                  </button>
                  <button @click="editClient(client)" class="text-sm text-green-600 hover:text-green-900">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración -->
      <div v-else-if="activeTab === 'config'" class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>
          <p class="mt-2 text-sm text-gray-700">Configura tipos de tarea, estados y áreas de cobro.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Tipos de Tarea -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Tipos de Tarea</h3>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div v-for="type in taskTypes" :key="type.id" class="flex items-center justify-between">
                  <span class="text-sm text-gray-900">{{ type.name }}</span>
                  <button @click="removeTaskType(type)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <div class="mt-4 flex">
                <input 
                  v-model="newTaskType" 
                  @keyup.enter="addTaskType"
                  type="text" 
                  placeholder="Nuevo tipo de tarea"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button @click="addTaskType" class="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Áreas de Cobro -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Áreas de Cobro</h3>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div v-for="area in billingAreas" :key="area.id" class="flex items-center justify-between">
                  <span class="text-sm text-gray-900">{{ area.name }}</span>
                  <button @click="removeBillingArea(area)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <div class="mt-4 flex">
                <input 
                  v-model="newBillingArea" 
                  @keyup.enter="addBillingArea"
                  type="text" 
                  placeholder="Nueva área de cobro"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button @click="addBillingArea" class="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes -->
      <div v-else-if="activeTab === 'reports'" class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Reportes y Métricas</h2>
          <p class="mt-2 text-sm text-gray-700">Genera reportes operativos y de rendimiento.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="report in availableReports" :key="report.id" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <i :class="report.icon" class="text-blue-500 text-2xl"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ report.name }}</dt>
                    <dd class="text-sm text-gray-900">{{ report.description }}</dd>
                  </dl>
                </div>
              </div>
              <div class="mt-5">
                <button @click="generateReport(report)" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
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
  name: 'SupervisorView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const activeTab = ref('dashboard')
    const loadingTasks = ref(false)
    
    // Data
    const stats = ref({
      activeTasks: 12,
      pendingTasks: 5,
      completedToday: 8,
      activeTechnicians: 3
    })
    
    const technicians = ref([
      { id: 1, name: 'Ana Técnico', tasksAssigned: 4, status: 'En Terreno' },
      { id: 2, name: 'Carlos López', tasksAssigned: 3, status: 'Disponible' },
      { id: 3, name: 'María González', tasksAssigned: 5, status: 'En Terreno' }
    ])
    
    const tasks = ref([
      { id: 1, title: 'Instalación POS - Sucursal Centro', technician: 'Ana Técnico', client: 'Retail ABC', date: '2025-01-13', status: 'ENEJECUCION', priority: 'Alta' },
      { id: 2, title: 'Mantención Red - Oficina Principal', technician: 'Carlos López', client: 'Empresa XYZ', date: '2025-01-13', status: 'ASIGNADA', priority: 'Media' },
      { id: 3, title: 'Soporte Técnico - Punto Venta', technician: 'María González', client: 'Tienda 123', date: '2025-01-14', status: 'FINALIZADA', priority: 'Baja' }
    ])
    
    const clients = ref([
      { id: 1, name: 'Retail ABC', rut: '76.123.456-7', locations: 12, activeTasks: 3 },
      { id: 2, name: 'Empresa XYZ', rut: '96.789.123-4', locations: 5, activeTasks: 2 },
      { id: 3, name: 'Tienda 123', rut: '77.456.789-1', locations: 8, activeTasks: 1 }
    ])
    
    const taskTypes = ref([
      { id: 1, name: 'Instalación POS' },
      { id: 2, name: 'Mantención Preventiva' },
      { id: 3, name: 'Soporte en Sitio' },
      { id: 4, name: 'Configuración Red' }
    ])
    
    const billingAreas = ref([
      { id: 1, name: 'Retail - Tiendas' },
      { id: 2, name: 'Corporativo - Oficinas' },
      { id: 3, name: 'Mantenimiento' },
      { id: 4, name: 'Instalaciones' }
    ])
    
    const availableReports = ref([
      { id: 1, name: 'Productividad Técnicos', description: 'Rendimiento por técnico', icon: 'fas fa-chart-bar' },
      { id: 2, name: 'Tareas por Cliente', description: 'Resumen por cliente', icon: 'fas fa-building' },
      { id: 3, name: 'Tiempos de Ejecución', description: 'Análisis de tiempos', icon: 'fas fa-clock' },
      { id: 4, name: 'Estado de Tareas', description: 'Resumen de estados', icon: 'fas fa-tasks' }
    ])
    
    // Filters
    const taskFilters = ref({
      status: '',
      technician: '',
      client: '',
      date: ''
    })
    
    // Form data
    const newTaskType = ref('')
    const newBillingArea = ref('')
    
    // Toast
    const toast = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Tabs para supervisor
    const tabs = [
      { key: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-bar' },
      { key: 'tasks', name: 'Tareas', icon: 'fas fa-tasks' },
      { key: 'clients', name: 'Clientes', icon: 'fas fa-building' },
      { key: 'config', name: 'Configuración', icon: 'fas fa-cog' },
      { key: 'reports', name: 'Reportes', icon: 'fas fa-chart-line' }
    ]

    // Computed
    const userName = computed(() => userStore.userName)
    const userRole = computed(() => userStore.userRole)
    
    const filteredTasks = computed(() => {
      let filtered = tasks.value
      
      if (taskFilters.value.status) {
        filtered = filtered.filter(task => task.status === taskFilters.value.status)
      }
      
      if (taskFilters.value.technician) {
        filtered = filtered.filter(task => task.technicianId === taskFilters.value.technician)
      }
      
      if (taskFilters.value.client) {
        filtered = filtered.filter(task => task.clientId === taskFilters.value.client)
      }
      
      if (taskFilters.value.date) {
        filtered = filtered.filter(task => task.date === taskFilters.value.date)
      }
      
      return filtered
    })

    // Methods
    const getTaskStatusClass = (status) => {
      switch (status) {
        case 'ASIGNADA':
          return 'bg-blue-100 text-blue-800'
        case 'ENEJECUCION':
          return 'bg-yellow-100 text-yellow-800'
        case 'FINALIZADA':
          return 'bg-green-100 text-green-800'
        case 'CANCELADA':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const formatDate = (date) => {
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

    // Task methods
    const openTaskModal = () => {
      showToast('Funcionalidad de crear tarea próximamente', 'info')
    }

    const viewTask = (task) => {
      showToast(`Viendo detalles de: ${task.title}`, 'info')
    }

    const editTask = (task) => {
      showToast(`Editando tarea: ${task.title}`, 'info')
    }

    const deleteTask = (task) => {
      if (confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
        const index = tasks.value.findIndex(t => t.id === task.id)
        if (index > -1) {
          tasks.value.splice(index, 1)
          showToast('Tarea eliminada correctamente', 'success')
        }
      }
    }

    // Client methods
    const openClientModal = () => {
      showToast('Funcionalidad de crear cliente próximamente', 'info')
    }

    const viewClient = (client) => {
      showToast(`Viendo detalles de: ${client.name}`, 'info')
    }

    const editClient = (client) => {
      showToast(`Editando cliente: ${client.name}`, 'info')
    }

    // Configuration methods
    const addTaskType = () => {
      if (newTaskType.value.trim()) {
        const newId = Math.max(...taskTypes.value.map(t => t.id)) + 1
        taskTypes.value.push({
          id: newId,
          name: newTaskType.value.trim()
        })
        newTaskType.value = ''
        showToast('Tipo de tarea agregado correctamente', 'success')
      }
    }

    const removeTaskType = (type) => {
      if (confirm(`¿Eliminar el tipo de tarea "${type.name}"?`)) {
        const index = taskTypes.value.findIndex(t => t.id === type.id)
        if (index > -1) {
          taskTypes.value.splice(index, 1)
          showToast('Tipo de tarea eliminado', 'success')
        }
      }
    }

    const addBillingArea = () => {
      if (newBillingArea.value.trim()) {
        const newId = Math.max(...billingAreas.value.map(a => a.id)) + 1
        billingAreas.value.push({
          id: newId,
          name: newBillingArea.value.trim()
        })
        newBillingArea.value = ''
        showToast('Área de cobro agregada correctamente', 'success')
      }
    }

    const removeBillingArea = (area) => {
      if (confirm(`¿Eliminar el área de cobro "${area.name}"?`)) {
        const index = billingAreas.value.findIndex(a => a.id === area.id)
        if (index > -1) {
          billingAreas.value.splice(index, 1)
          showToast('Área de cobro eliminada', 'success')
        }
      }
    }

    // Report methods
    const generateReport = (report) => {
      showToast(`Generando reporte: ${report.name}`, 'info')
      // Aquí iría la lógica de generación de reportes
    }

    const logout = async () => {
      await userStore.logout()
      router.push('/login')
    }

    // Lifecycle
    onMounted(() => {
      console.log('Vista de Supervisor cargada')
    })

    return {
      // State
      activeTab,
      loadingTasks,
      stats,
      technicians,
      tasks,
      clients,
      taskTypes,
      billingAreas,
      availableReports,
      taskFilters,
      newTaskType,
      newBillingArea,
      toast,
      tabs,
      
      // Computed
      userName,
      userRole,
      filteredTasks,
      
      // Methods
      getTaskStatusClass,
      formatDate,
      openTaskModal,
      viewTask,
      editTask,
      deleteTask,
      openClientModal,
      viewClient,
      editClient,
      addTaskType,
      removeTaskType,
      addBillingArea,
      removeBillingArea,
      generateReport,
      logout
    }
  }
}
</script>