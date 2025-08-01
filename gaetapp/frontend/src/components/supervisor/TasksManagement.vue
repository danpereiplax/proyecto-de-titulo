<script>
import { ref, computed, onMounted, watch } from 'vue'
import TaskModal from '@/components/supervisor/tasks/TaskModal.vue'
import TaskDetailModal from '@/components/supervisor/tasks/TaskDetailModal.vue'
import BulkAssignModal from '@/components/supervisor/tasks/BulkAssignModal.vue'
import supervisorService from '@/services/supervisorService'


export default {
  name: 'TasksManagement',
  components: {
    TaskModal,
    TaskDetailModal,
    BulkAssignModal
  },
  props: {
    tasks: {
      type: Array,
      required: true
    },
    technicians: {
      type: Array,
      required: true
    },
    clients: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['task-created', 'task-updated', 'task-deleted', 'show-toast', 'refresh-data'],
  setup(props, { emit }) {
    // State
    const showTaskModal = ref(false)
    const showDetailModal = ref(false)
    const showBulkAssignModal = ref(false)
    const selectedTask = ref(null)
    const selectedTasks = ref([])
    const taskTypes = ref([])
    
    // Filters
    const filters = ref({
      status: '',
      technician: '',
      client: '',
      date: '',
      search: ''
    })
    const quickFilter = ref('')
    
    // Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Computed
    const filteredTasks = computed(() => {
      let filtered = [...props.tasks]
      
      // Apply filters
      if (filters.value.status) {
        filtered = filtered.filter(task => task.status === filters.value.status)
      }
      
      if (filters.value.technician) {
        filtered = filtered.filter(task => task.technicianId === filters.value.technician)
      }
      
      if (filters.value.client) {
        filtered = filtered.filter(task => task.clientId === filters.value.client)
      }
      
      if (filters.value.date) {
        filtered = filtered.filter(task => task.date === filters.value.date)
      }
      
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search) ||
          task.client.toLowerCase().includes(search) ||
          task.technician.toLowerCase().includes(search)
        )
      }
      
      // Apply quick filters
      if (quickFilter.value === 'today') {
        const today = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(task => task.date === today)
      } else if (quickFilter.value === 'week') {
        const now = new Date()
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.date)
          return taskDate >= weekStart && taskDate <= weekEnd
        })
      } else if (quickFilter.value === 'overdue') {
        const today = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(task => 
          task.date < today && !['FINALIZADA', 'CANCELADA'].includes(task.status)
        )
      } else if (quickFilter.value === 'unassigned') {
        filtered = filtered.filter(task => !task.technicianId)
      }
      
      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredTasks.value.length / itemsPerPage.value)
    })

    const paginatedTasks = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredTasks.value.slice(start, end)
    })

    const startItem = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value + 1
    })

    const endItem = computed(() => {
      return Math.min(currentPage.value * itemsPerPage.value, filteredTasks.value.length)
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

    const allSelected = computed(() => {
      return paginatedTasks.value.length > 0 && 
            selectedTasks.value.length === paginatedTasks.value.length
    })

    const selectedTaskObjects = computed(() => {
      return props.tasks.filter(task => selectedTasks.value.includes(task.id))
    })

    // Methods
    const loadTaskTypes = async () => {
      try {
        taskTypes.value = await supervisorService.getTaskTypes()
      } catch (error) {
        console.error('Error loading task types:', error)
        emit('show-toast', 'Error cargando tipos de tarea', 'error')
      }
    }

    const refreshTasks = () => {
      emit('refresh-data')
    }

    const applyFilters = () => {
      currentPage.value = 1
      quickFilter.value = ''
    }

    const setQuickFilter = (filter) => {
      quickFilter.value = quickFilter.value === filter ? '' : filter
      currentPage.value = 1
    }

    const clearFilters = () => {
      filters.value = {
        status: '',
        technician: '',
        client: '',
        date: '',
        search: ''
      }
      quickFilter.value = ''
      currentPage.value = 1
    }

    // Task Actions
    const openTaskModal = (task = null) => {
      selectedTask.value = task
      showTaskModal.value = true
    }

    const closeTaskModal = () => {
      showTaskModal.value = false
      selectedTask.value = null
    }

    const saveTask = async (taskData) => {
      try {
        if (taskData.id) {
          emit('task-updated', taskData)
          emit('show-toast', 'Tarea actualizada correctamente', 'success')
        } else {
          emit('task-created', taskData)
          emit('show-toast', 'Tarea creada correctamente', 'success')
        }
        closeTaskModal()
      } catch (error) {
        console.error('Error saving task:', error)
        emit('show-toast', 'Error al guardar la tarea', 'error')
      }
    }

    const viewTask = (task) => {
      selectedTask.value = task
      showDetailModal.value = true
    }

    const editTask = (task) => {
      selectedTask.value = task
      showDetailModal.value = false
      showTaskModal.value = true
    }

    const duplicateTask = (task) => {
      const duplicatedTask = {
        ...task,
        id: null,
        title: `${task.title} (Copia)`,
        status: 'ASIGNADA',
        date: new Date().toISOString().split('T')[0]
      }
      openTaskModal(duplicatedTask)
    }

    const deleteTask = async (task) => {
      if (confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
        try {
          emit('task-deleted', task.id)
          emit('show-toast', 'Tarea eliminada correctamente', 'success')
        } catch (error) {
          console.error('Error deleting task:', error)
          emit('show-toast', 'Error al eliminar la tarea', 'error')
        }
      }
    }

    // Selection Methods
    const toggleSelectAll = () => {
      if (allSelected.value) {
        selectedTasks.value = []
      } else {
        selectedTasks.value = paginatedTasks.value.map(task => task.id)
      }
    }

    // Bulk Actions
    const bulkAssign = () => {
      if (selectedTasks.value.length === 0) {
        emit('show-toast', 'Selecciona al menos una tarea', 'warning')
        return
      }
      showBulkAssignModal.value = true
    }

    const bulkChangeStatus = async () => {
      if (selectedTasks.value.length === 0) {
        emit('show-toast', 'Selecciona al menos una tarea', 'warning')
        return
      }
      
      const newStatus = prompt('Nuevo estado (ASIGNADA, ENEJECUCION, FINALIZADA, CANCELADA):')
      if (newStatus && ['ASIGNADA', 'ENEJECUCION', 'FINALIZADA', 'CANCELADA'].includes(newStatus)) {
        try {
          // Implementar cambio masivo de estado
          emit('show-toast', `${selectedTasks.value.length} tareas actualizadas`, 'success')
          selectedTasks.value = []
        } catch (error) {
          emit('show-toast', 'Error al actualizar tareas', 'error')
        }
      }
    }

    const bulkDelete = async () => {
      if (selectedTasks.value.length === 0) {
        emit('show-toast', 'Selecciona al menos una tarea', 'warning')
        return
      }
      
      if (confirm(`¿Estás seguro de eliminar ${selectedTasks.value.length} tareas?`)) {
        try {
          for (const taskId of selectedTasks.value) {
            emit('task-deleted', taskId)
          }
          emit('show-toast', `${selectedTasks.value.length} tareas eliminadas`, 'success')
          selectedTasks.value = []
        } catch (error) {
          emit('show-toast', 'Error al eliminar tareas', 'error')
        }
      }
    }

    const handleBulkAssign = async (assignmentData) => {
      try {
        // Implementar asignación masiva
        emit('show-toast', `${selectedTasks.value.length} tareas asignadas`, 'success')
        selectedTasks.value = []
        showBulkAssignModal.value = false
      } catch (error) {
        emit('show-toast', 'Error al asignar tareas', 'error')
      }
    }

    // Pagination
    const goToPage = (page) => {
      currentPage.value = page
      selectedTasks.value = []
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        selectedTasks.value = []
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        selectedTasks.value = []
      }
    }

    // Utility Methods
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

    const getStatusLabel = (status) => {
      const labels = {
        'ASIGNADA': 'Asignada',
        'ENEJECUCION': 'En Ejecución',
        'FINALIZADA': 'Finalizada',
        'CANCELADA': 'Cancelada'
      }
      return labels[status] || status
    }

    const getPriorityClass = (priority) => {
      switch (priority) {
        case 'Alta':
          return 'bg-red-100 text-red-800'
        case 'Media':
          return 'bg-yellow-100 text-yellow-800'
        case 'Baja':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('es-CL')
    }

    // Watchers
    watch(() => filteredTasks.value.length, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    })

    // Lifecycle
    onMounted(() => {
      loadTaskTypes()
    })

    return {
      // State
      showTaskModal,
      showDetailModal,
      showBulkAssignModal,
      selectedTask,
      selectedTasks,
      taskTypes,
      filters,
      quickFilter,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredTasks,
      totalPages,
      paginatedTasks,
      startItem,
      endItem,
      visiblePages,
      allSelected,
      selectedTaskObjects,
      
      // Methods
      refreshTasks,
      applyFilters,
      setQuickFilter,
      clearFilters,
      openTaskModal,
      closeTaskModal,
      saveTask,
      viewTask,
      editTask,
      duplicateTask,
      deleteTask,
      toggleSelectAll,
      bulkAssign,
      bulkChangeStatus,
      bulkDelete,
      handleBulkAssign,
      goToPage,
      previousPage,
      nextPage,
      getTaskStatusClass,
      getStatusLabel,
      getPriorityClass,
      formatDate
    }
  }
}
</script>