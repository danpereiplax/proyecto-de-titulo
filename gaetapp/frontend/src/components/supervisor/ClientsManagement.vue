<!-- frontend/src/components/supervisor/ClientsManagement.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h2 class="text-xl font-semibold text-gray-900">Gestión de Clientes</h2>
        <p class="mt-2 text-sm text-gray-700">
          Administra los clientes y sus ubicaciones. 
          <span class="font-medium">{{ filteredClients.length }}</span> clientes activos.
        </p>
      </div>
      <div class="mt-4 space-x-3 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          @click="refreshClients" 
          :disabled="loading"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="mr-2"></i>
          Actualizar
        </button>
        <button 
          @click="openClientModal()" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <i class="mr-2 fas fa-plus"></i>
          Nuevo Cliente
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="p-4 bg-white border rounded-lg shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="md:col-span-2">
          <label class="block mb-1 text-sm font-medium text-gray-700">Buscar Cliente</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="applyFilters"
              type="text"
              placeholder="Buscar por nombre, RUT o email..."
              class="w-full py-2 pl-10 pr-4 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <i class="absolute text-gray-400 fas fa-search left-3 top-3"></i>
          </div>
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Estado</label>
          <select 
            v-model="filters.status" 
            @change="applyFilters"
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Ordenar Por</label>
          <select 
            v-model="sortBy" 
            @change="applyFilters"
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="name">Nombre</option>
            <option value="activeTasks">Tareas Activas</option>
            <option value="totalTasks">Total Tareas</option>
            <option value="locations">Ubicaciones</option>
            <option value="createdAt">Fecha Registro</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-blue-500 fas fa-building"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Total Clientes</p>
            <p class="text-lg font-semibold text-gray-900">{{ clients.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-green-500 fas fa-tasks"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Tareas Activas</p>
            <p class="text-lg font-semibold text-gray-900">{{ totalActiveTasks }}</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-purple-500 fas fa-map-marker-alt"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Ubicaciones</p>
            <p class="text-lg font-semibold text-gray-900">{{ totalLocations }}</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-yellow-500 fas fa-chart-line"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Promedio Tareas</p>
            <p class="text-lg font-semibold text-gray-900">{{ averageTasksPerClient }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Clients Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 6" :key="n" class="bg-white border rounded-lg shadow animate-pulse">
        <div class="p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div class="flex-1 ml-4">
              <div class="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
              <div class="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full h-3 mb-2 bg-gray-200 rounded"></div>
            <div class="w-2/3 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredClients.length === 0" class="py-12 text-center">
      <i class="mb-4 text-4xl text-gray-300 fas fa-building"></i>
      <h3 class="mb-2 text-lg font-medium text-gray-900">
        {{ clients.length === 0 ? 'No hay clientes registrados' : 'No se encontraron clientes' }}
      </h3>
      <p class="mb-4 text-gray-500">
        {{ clients.length === 0 
          ? 'Comienza agregando tu primer cliente' 
          : 'Intenta ajustar los filtros de búsqueda'
        }}
      </p>
      <button 
        v-if="clients.length === 0"
        @click="openClientModal()" 
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
      >
        <i class="mr-2 fas fa-plus"></i>
        Agregar Primer Cliente
      </button>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="client in paginatedClients" 
        :key="client.id" 
        class="transition-shadow duration-200 bg-white border rounded-lg shadow hover:shadow-lg"
      >
        <div class="p-6">
          <!-- Client Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
                <i class="text-xl text-blue-600 fas fa-building"></i>
              </div>
              <div class="flex-1 min-w-0 ml-4">
                <h3 class="text-sm font-medium text-gray-900 truncate">{{ client.name }}</h3>
                <p class="text-sm text-gray-500 truncate">{{ client.rut }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <button 
                @click="viewClient(client)" 
                class="p-1 text-blue-600 hover:text-blue-900"
                title="Ver detalles"
              >
                <i class="text-sm fas fa-eye"></i>
              </button>
              <button 
                @click="editClient(client)" 
                class="p-1 text-green-600 hover:text-green-900"
                title="Editar"
              >
                <i class="text-sm fas fa-edit"></i>
              </button>
              <button 
                @click="deleteClient(client)" 
                class="p-1 text-red-600 hover:text-red-900"
                title="Eliminar"
              >
                <i class="text-sm fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Client Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-3 text-center rounded-lg bg-gray-50">
              <p class="text-2xl font-bold text-gray-900">{{ client.locations }}</p>
              <p class="text-xs text-gray-500">Ubicaciones</p>
            </div>
            <div class="p-3 text-center rounded-lg bg-gray-50">
              <p class="text-2xl font-bold text-gray-900">{{ client.activeTasks }}</p>
              <p class="text-xs text-gray-500">Tareas Activas</p>
            </div>
          </div>

          <!-- Client Details -->
          <div class="space-y-2 text-sm">
            <div v-if="client.email" class="flex items-center text-gray-600">
              <i class="w-4 mr-2 fas fa-envelope"></i>
              <span class="truncate">{{ client.email }}</span>
            </div>
            <div v-if="client.phone" class="flex items-center text-gray-600">
              <i class="w-4 mr-2 fas fa-phone"></i>
              <span>{{ client.phone }}</span>
            </div>
            <div v-if="client.address" class="flex items-center text-gray-600">
              <i class="w-4 mr-2 fas fa-map-marker-alt"></i>
              <span class="truncate">{{ client.address }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex mt-4 space-x-2">
            <button 
              @click="viewClientTasks(client)"
              class="flex-1 px-3 py-2 text-sm font-medium text-blue-700 transition-colors rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <i class="mr-1 fas fa-tasks"></i>
              Ver Tareas
            </button>
            <button 
              @click="createTaskForClient(client)"
              class="flex-1 px-3 py-2 text-sm font-medium text-green-700 transition-colors rounded-md bg-green-50 hover:bg-green-100"
            >
              <i class="mr-1 fas fa-plus"></i>
              Nueva Tarea
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-lg">
      <div class="flex justify-between flex-1 sm:hidden">
        <button 
          @click="previousPage" 
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Anterior
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Mostrando 
            <span class="font-medium">{{ startItem }}</span>
            a 
            <span class="font-medium">{{ endItem }}</span>
            de 
            <span class="font-medium">{{ filteredClients.length }}</span>
            clientes
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="goToPage(page)"
              :class="page === currentPage 
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium border"
            >
              {{ page }}
            </button>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Client Modal -->
    <client-modal
      v-if="showClientModal"
      :client="selectedClient"
      @close="closeClientModal"
      @save="saveClient"
    />
    
    <!-- Client Detail Modal -->
    <client-detail-modal
      v-if="showDetailModal"
      :client="selectedClient"
      @close="showDetailModal = false"
      @edit="editClient"
      @create-task="createTaskForClient"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import ClientModal from './clients/ClientModal.vue'
import ClientDetailModal from './clients/ClientDetailModal.vue'
import supervisorService from '@/services/supervisorService.js'

export default {
  name: 'ClientsManagement',
  components: {
    ClientModal,
    ClientDetailModal
  },
  props: {
    clients: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['client-created', 'client-updated', 'client-deleted', 'show-toast', 'refresh-data', 'create-task-for-client', 'view-client-tasks'],
  setup(props, { emit }) {
    // State
    const showClientModal = ref(false)
    const showDetailModal = ref(false)
    const selectedClient = ref(null)
    const searchQuery = ref('')
    const filters = ref({
      status: ''
    })
    const sortBy = ref('name')
    
    // Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(9)

    // Computed
    const filteredClients = computed(() => {
      let filtered = [...props.clients]
      
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(client => 
          client.name.toLowerCase().includes(query) ||
          client.rut.toLowerCase().includes(query) ||
          (client.email && client.email.toLowerCase().includes(query))
        )
      }
      
      // Status filter
      if (filters.value.status === 'active') {
        filtered = filtered.filter(client => client.activeTasks > 0)
      } else if (filters.value.status === 'inactive') {
        filtered = filtered.filter(client => client.activeTasks === 0)
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'activeTasks':
            return b.activeTasks - a.activeTasks
          case 'totalTasks':
            return (b.totalTasks || 0) - (a.totalTasks || 0)
          case 'locations':
            return b.locations - a.locations
          case 'createdAt':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          default:
            return 0
        }
      })
      
      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredClients.value.length / itemsPerPage.value)
    })

    const paginatedClients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredClients.value.slice(start, end)
    })

    const startItem = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value + 1
    })

    const endItem = computed(() => {
      return Math.min(currentPage.value * itemsPerPage.value, filteredClients.value.length)
    })

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Stats
    const totalActiveTasks = computed(() => {
      return props.clients.reduce((sum, client) => sum + client.activeTasks, 0)
    })

    const totalLocations = computed(() => {
      return props.clients.reduce((sum, client) => sum + client.locations, 0)
    })

    const averageTasksPerClient = computed(() => {
      if (props.clients.length === 0) return 0
      const total = props.clients.reduce((sum, client) => sum + (client.totalTasks || client.activeTasks), 0)
      return Math.round(total / props.clients.length * 10) / 10
    })

    // Methods
    const refreshClients = () => {
      emit('refresh-data')
    }

    const applyFilters = () => {
      currentPage.value = 1
    }

    // Client Actions
    const openClientModal = (client = null) => {
      selectedClient.value = client
      showClientModal.value = true
    }

    const closeClientModal = () => {
      showClientModal.value = false
      selectedClient.value = null
    }

    const saveClient = async (clientData) => {
      try {
        if (clientData.id) {
          emit('client-updated', clientData)
          emit('show-toast', 'Cliente actualizado correctamente', 'success')
        } else {
          emit('client-created', clientData)
          emit('show-toast', 'Cliente creado correctamente', 'success')
        }
        closeClientModal()
      } catch (error) {
        console.error('Error saving client:', error)
        emit('show-toast', 'Error al guardar el cliente', 'error')
      }
    }

    const viewClient = (client) => {
      selectedClient.value = client
      showDetailModal.value = true
    }

    const editClient = (client) => {
      selectedClient.value = client
      showDetailModal.value = false
      showClientModal.value = true
    }

    const deleteClient = async (client) => {
      if (client.activeTasks > 0) {
        emit('show-toast', 'No se puede eliminar un cliente con tareas activas', 'warning')
        return
      }

      if (confirm(`¿Estás seguro de eliminar el cliente "${client.name}"?\n\nEsta acción no se puede deshacer.`)) {
        try {
          emit('client-deleted', client.id)
          emit('show-toast', 'Cliente eliminado correctamente', 'success')
        } catch (error) {
          console.error('Error deleting client:', error)
          emit('show-toast', 'Error al eliminar el cliente', 'error')
        }
      }
    }

    const viewClientTasks = (client) => {
      emit('view-client-tasks', client)
    }

    const createTaskForClient = (client) => {
      emit('create-task-for-client', client)
    }

    // Pagination
    const goToPage = (page) => {
      currentPage.value = page
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // Watchers
    watch(() => filteredClients.value.length, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    })

    return {
      // State
      showClientModal,
      showDetailModal,
      selectedClient,
      searchQuery,
      filters,
      sortBy,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredClients,
      totalPages,
      paginatedClients,
      startItem,
      endItem,
      visiblePages,
      totalActiveTasks,
      totalLocations,
      averageTasksPerClient,
      
      // Methods
      refreshClients,
      applyFilters,
      openClientModal,
      closeClientModal,
      saveClient,
      viewClient,
      editClient,
      deleteClient,
      viewClientTasks,
      createTaskForClient,
      goToPage,
      previousPage,
      nextPage
    }
  }
}
</script>


