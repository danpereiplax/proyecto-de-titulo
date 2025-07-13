<!-- frontend/src/views/TecnicoView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <i class="fas fa-tools text-sm"></i>
            </div>
            <div>
              <h1 class="text-lg font-semibold">{{ userName }}</h1>
              <p class="text-blue-200 text-xs">{{ currentDate }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <i class="fas fa-bell text-xl"></i>
              <span v-if="pendingTasksCount > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {{ pendingTasksCount }}
              </span>
            </div>
            <button @click="showMenu = !showMenu" class="p-2 menu-toggle">
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Dropdown -->
    <div v-if="showMenu" class="absolute top-16 right-4 left-4 bg-white rounded-lg shadow-lg z-40 border menu-dropdown">
      <div class="py-2">
        <button @click="activeView = 'tasks'; showMenu = false" 
                :class="activeView === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center">
          <i class="fas fa-clipboard-list mr-3"></i>
          Mis Tareas
        </button>
        <button @click="activeView = 'history'; showMenu = false"
                :class="activeView === 'history' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center">
          <i class="fas fa-history mr-3"></i>
          Historial
        </button>
        <button @click="activeView = 'profile'; showMenu = false"
                :class="activeView === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center">
          <i class="fas fa-user mr-3"></i>
          Mi Perfil
        </button>
        <div class="border-t border-gray-200 mt-2 pt-2">
          <button @click="logout" class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center">
            <i class="fas fa-sign-out-alt mr-3"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pb-20">
      <!-- Mis Tareas -->
      <div v-if="activeView === 'tasks'" class="p-4 space-y-4">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-4 shadow-sm border">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-clock text-blue-600 text-sm"></i>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs text-gray-500">Pendientes</p>
                <p class="text-lg font-semibold text-gray-900">{{ pendingTasksCount }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4 shadow-sm border">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-check text-green-600 text-sm"></i>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs text-gray-500">Completadas Hoy</p>
                <p class="text-lg font-semibold text-gray-900">{{ completedTodayCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Filter -->
        <div class="bg-white rounded-lg p-3 shadow-sm border">
          <div class="flex items-center space-x-2">
            <i class="fas fa-filter text-gray-400"></i>
            <select v-model="taskFilter" class="flex-1 bg-transparent border-none focus:ring-0 text-sm">
              <option value="all">Todas las tareas</option>
              <option value="pending">Pendientes</option>
              <option value="in-progress">En progreso</option>
              <option value="today">Para hoy</option>
            </select>
          </div>
        </div>

        <!-- Tasks List -->
        <div class="space-y-3">
          <div v-for="task in filteredTasks" :key="task.id" 
               class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <!-- Task Header -->
            <div class="p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900 text-sm leading-5">{{ task.title }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ task.client }}</p>
                </div>
                <span :class="getTaskStatusClass(task.status)" 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2">
                  {{ getTaskStatusText(task.status) }}
                </span>
              </div>
              
              <!-- Task Details -->
              <div class="mt-3 space-y-2">
                <div class="flex items-center text-xs text-gray-600">
                  <i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                  {{ task.location }}
                </div>
                <div class="flex items-center text-xs text-gray-600">
                  <i class="fas fa-calendar mr-2 text-gray-400"></i>
                  {{ formatDate(task.date) }} - {{ task.time }}
                </div>
                <div v-if="task.priority" class="flex items-center text-xs">
                  <i class="fas fa-exclamation-circle mr-2" 
                     :class="task.priority === 'Alta' ? 'text-red-500' : task.priority === 'Media' ? 'text-yellow-500' : 'text-gray-400'"></i>
                  Prioridad {{ task.priority }}
                </div>
              </div>
            </div>

            <!-- Task Actions -->
            <div class="border-t border-gray-100 px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Status Actions -->
                <div class="flex items-center space-x-2">
                  <button v-if="task.status === 'ASIGNADA'" 
                          @click="startTask(task)"
                          class="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors">
                    <i class="fas fa-play mr-1"></i>
                    Iniciar
                  </button>
                  
                  <button v-if="task.status === 'ENEJECUCION'" 
                          @click="completeTask(task)"
                          class="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-700 transition-colors">
                    <i class="fas fa-check mr-1"></i>
                    Completar
                  </button>
                  
                  <span v-if="task.status === 'FINALIZADA'" 
                        class="text-green-600 text-xs font-medium">
                    <i class="fas fa-check-circle mr-1"></i>
                    Finalizada
                  </span>
                </div>

                <!-- Detail Actions -->
                <div class="flex items-center space-x-3">
                  <button @click="viewTask(task)" class="text-gray-600 hover:text-gray-900">
                    <i class="fas fa-eye text-sm"></i>
                  </button>
                  <button @click="addPhoto(task)" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-camera text-sm"></i>
                  </button>
                  <button @click="addNote(task)" class="text-green-600 hover:text-green-900">
                    <i class="fas fa-sticky-note text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTasks.length === 0" class="text-center py-12">
          <div class="h-16 w-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <i class="fas fa-clipboard-list text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
          <p class="text-gray-500 text-sm">No tienes tareas {{ taskFilter === 'all' ? '' : getFilterText(taskFilter) }} en este momento.</p>
        </div>
      </div>

      <!-- Historial -->
      <div v-else-if="activeView === 'history'" class="p-4 space-y-4">
        <div class="bg-white rounded-lg p-4 shadow-sm border">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Historial de Tareas</h2>
          
          <!-- History Filter -->
          <div class="flex items-center space-x-2 mb-4">
            <i class="fas fa-calendar-alt text-gray-400"></i>
            <select v-model="historyFilter" class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="all">Todo el historial</option>
            </select>
          </div>

          <!-- History List -->
          <div class="space-y-3">
            <div v-for="task in historyTasks" :key="task.id" 
                 class="border border-gray-200 rounded-lg p-3">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 text-sm">{{ task.title }}</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ task.client }}</p>
                  <div class="flex items-center mt-2 text-xs text-gray-600">
                    <i class="fas fa-clock mr-1"></i>
                    {{ formatDate(task.completedDate) }}
                    <span class="ml-2">{{ task.duration }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-green-600 text-xs">
                    <i class="fas fa-check-circle"></i>
                  </span>
                  <button @click="viewHistoryTask(task)" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-eye text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mi Perfil -->
      <div v-else-if="activeView === 'profile'" class="p-4 space-y-4">
        <!-- Profile Card -->
        <div class="bg-white rounded-lg p-6 shadow-sm border text-center">
          <div class="h-20 w-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="fas fa-user text-blue-600 text-2xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">{{ userName }}</h2>
          <p class="text-gray-500 text-sm">{{ userRole }}</p>
          <p class="text-gray-400 text-xs mt-2">{{ userEmail }}</p>
        </div>

        <!-- Stats -->
        <div class="bg-white rounded-lg p-4 shadow-sm border">
          <h3 class="font-medium text-gray-900 mb-3">Estadísticas del Mes</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ monthlyStats.completed }}</p>
              <p class="text-xs text-gray-500">Completadas</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ monthlyStats.avgTime }}</p>
              <p class="text-xs text-gray-500">Tiempo promedio</p>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-medium text-gray-900">Configuración</h3>
          </div>
          <div class="divide-y divide-gray-200">
            <button class="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-bell mr-3 text-gray-400"></i>
                <span class="text-sm text-gray-900">Notificaciones</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button class="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt mr-3 text-gray-400"></i>
                <span class="text-sm text-gray-900">Ubicación</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button @click="changePassword" class="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-lock mr-3 text-gray-400"></i>
                <span class="text-sm text-gray-900">Cambiar Contraseña</span>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <div v-if="selectedTask" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div class="bg-white w-full max-h-[80vh] rounded-t-xl overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Detalle de Tarea</h3>
            <button @click="selectedTask = null" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-4 space-y-4">
          <div>
            <h4 class="font-medium text-gray-900">{{ selectedTask.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ selectedTask.description }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700">Cliente:</span>
              <p class="text-gray-600">{{ selectedTask.client }}</p>
            </div>
            <div>
              <span class="font-medium text-gray-700">Fecha:</span>
              <p class="text-gray-600">{{ formatDate(selectedTask.date) }}</p>
            </div>
            <div>
              <span class="font-medium text-gray-700">Ubicación:</span>
              <p class="text-gray-600">{{ selectedTask.location }}</p>
            </div>
            <div>
              <span class="font-medium text-gray-700">Estado:</span>
              <span :class="getTaskStatusClass(selectedTask.status)" 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getTaskStatusText(selectedTask.status) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3 pt-4">
            <button v-if="selectedTask.status === 'ASIGNADA'" 
                    @click="startTask(selectedTask); selectedTask = null"
                    class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <i class="fas fa-play mr-2"></i>
              Iniciar Tarea
            </button>
            
            <button v-if="selectedTask.status === 'ENEJECUCION'" 
                    @click="completeTask(selectedTask); selectedTask = null"
                    class="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              <i class="fas fa-check mr-2"></i>
              Completar
            </button>
            
            <button @click="addPhoto(selectedTask)" 
                    class="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              <i class="fas fa-camera"></i>
            </button>
            
            <button @click="addNote(selectedTask)" 
                    class="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              <i class="fas fa-sticky-note"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="fixed bottom-20 left-4 right-4 z-50">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg text-white text-center',
        toast.type === 'success' ? 'bg-green-500' : 
        toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      ]">
        <div class="flex items-center justify-center">
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

export default {
  name: 'TecnicoView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const activeView = ref('tasks')
    const showMenu = ref(false)
    const taskFilter = ref('all')
    const historyFilter = ref('today')
    const selectedTask = ref(null)
    
    // Data
    const tasks = ref([
      {
        id: 1,
        title: 'Instalación POS Terminal 1',
        client: 'Retail ABC - Sucursal Centro',
        location: 'Av. Libertador 1234, Centro',
        date: '2025-01-13',
        time: '09:00',
        status: 'ASIGNADA',
        priority: 'Alta',
        description: 'Instalación y configuración de terminal POS en caja principal'
      },
      {
        id: 2,
        title: 'Mantención Red Corporativa',
        client: 'Empresa XYZ',
        location: 'Torre Empresarial, Piso 15',
        date: '2025-01-13',
        time: '14:00',
        status: 'ENEJECUCION',
        priority: 'Media',
        description: 'Revisión y mantención de equipos de red corporativa'
      },
      {
        id: 3,
        title: 'Soporte Técnico Urgente',
        client: 'Tienda 123',
        location: 'Mall Plaza, Local 45',
        date: '2025-01-14',
        time: '10:00',
        status: 'ASIGNADA',
        priority: 'Baja',
        description: 'Resolución de problemas de conectividad'
      }
    ])
    
    const historyTasks = ref([
      {
        id: 101,
        title: 'Configuración Router WiFi',
        client: 'Café Central',
        completedDate: '2025-01-12',
        duration: '2h 30min'
      },
      {
        id: 102,
        title: 'Instalación Cámaras Seguridad',
        client: 'Oficina Legal',
        completedDate: '2025-01-11',
        duration: '4h 15min'
      }
    ])
    
    const monthlyStats = ref({
      completed: 28,
      avgTime: '2.5h'
    })
    
    // Toast
    const toast = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Computed
    const userName = computed(() => userStore.userName || 'Técnico')
    const userRole = computed(() => userStore.userRole || 'TECNICO')
    const userEmail = computed(() => {
      const userData = localStorage.getItem('gaet_user')
      if (userData) {
        const user = JSON.parse(userData)
        return user.email
      }
      return ''
    })
    
    const currentDate = computed(() => {
      return new Date().toLocaleDateString('es-CL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    })
    
    const filteredTasks = computed(() => {
      let filtered = tasks.value
      
      switch (taskFilter.value) {
        case 'pending':
          filtered = filtered.filter(task => task.status === 'ASIGNADA')
          break
        case 'in-progress':
          filtered = filtered.filter(task => task.status === 'ENEJECUCION')
          break
        case 'today':
          const today = new Date().toISOString().split('T')[0]
          filtered = filtered.filter(task => task.date === today)
          break
        default:
          // 'all' - no filtering
          break
      }
      
      return filtered
    })
    
    const pendingTasksCount = computed(() => {
      return tasks.value.filter(task => task.status === 'ASIGNADA').length
    })
    
    const completedTodayCount = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return historyTasks.value.filter(task => task.completedDate === today).length
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

    const getTaskStatusText = (status) => {
      switch (status) {
        case 'ASIGNADA':
          return 'Asignada'
        case 'ENEJECUCION':
          return 'En Progreso'
        case 'FINALIZADA':
          return 'Finalizada'
        case 'CANCELADA':
          return 'Cancelada'
        default:
          return status
      }
    }

    const getFilterText = (filter) => {
      switch (filter) {
        case 'pending':
          return 'pendientes'
        case 'in-progress':
          return 'en progreso'
        case 'today':
          return 'para hoy'
        default:
          return ''
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-CL', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
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

    // Task Actions
    const startTask = (task) => {
      task.status = 'ENEJECUCION'
      task.startTime = new Date().toISOString()
      showToast(`Tarea "${task.title}" iniciada`, 'success')
      showMenu.value = false
    }

    const completeTask = (task) => {
      if (confirm(`¿Confirmas que completaste la tarea "${task.title}"?`)) {
        task.status = 'FINALIZADA'
        task.endTime = new Date().toISOString()
        
        // Move to history
        const completedTask = {
          ...task,
          completedDate: new Date().toISOString().split('T')[0],
          duration: '2h 15min'
        }
        historyTasks.value.unshift(completedTask)
        
        // Remove from active tasks
        const index = tasks.value.findIndex(t => t.id === task.id)
        if (index > -1) {
          tasks.value.splice(index, 1)
        }
        
        showToast('¡Tarea completada exitosamente!', 'success')
        showMenu.value = false
      }
    }

    const viewTask = (task) => {
      selectedTask.value = task
      showMenu.value = false
    }

    const viewHistoryTask = (task) => {
      showToast(`Viendo detalles de: ${task.title}`, 'info')
    }

    const addPhoto = (task) => {
      showToast('Funcionalidad de fotografías próximamente', 'info')
      selectedTask.value = null
      showMenu.value = false
    }

    const addNote = (task) => {
      showToast('Funcionalidad de observaciones próximamente', 'info')
      selectedTask.value = null
      showMenu.value = false
    }

    const changePassword = () => {
      showToast('Funcionalidad de cambio de contraseña próximamente', 'info')
    }

    const logout = async () => {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        await userStore.logout()
        router.push('/login')
      }
    }

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-toggle') && !event.target.closest('.menu-dropdown')) {
        showMenu.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      console.log('Vista de Técnico cargada')
      document.addEventListener('click', handleClickOutside)
    })

    return {
      // State
      activeView,
      showMenu,
      taskFilter,
      historyFilter,
      selectedTask,
      tasks,
      historyTasks,
      monthlyStats,
      toast,
      
      // Computed
      userName,
      userRole,
      userEmail,
      currentDate,
      filteredTasks,
      pendingTasksCount,
      completedTodayCount,
      
      // Methods
      getTaskStatusClass,
      getTaskStatusText,
      getFilterText,
      formatDate,
      startTask,
      completeTask,
      viewTask,
      viewHistoryTask,
      addPhoto,
      addNote,
      changePassword,
      logout
    }
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}
</style>