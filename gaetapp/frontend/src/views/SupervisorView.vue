<!-- frontend/src/views/SupervisorView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Component -->
    <supervisor-header 
      :user-name="userName" 
      :user-role="userRole" 
      @logout="logout" 
    />

    <!-- Navigation Tabs Component -->
    <supervisor-tabs 
      :active-tab="activeTab" 
      @tab-change="activeTab = $event" 
    />

    <!-- Content Area -->
    <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      <!-- Dashboard Operativo -->
      <supervisor-dashboard 
        v-if="activeTab === 'dashboard'"
        :stats="stats"
        :technicians="technicians"
      />

      <!-- Gestión de Tareas -->
      <tasks-management 
        v-else-if="activeTab === 'tasks'"
        :tasks="tasks"
        :technicians="technicians"
        :clients="clients"
        :loading="loadingTasks"
        @task-created="handleTaskCreated"
        @task-updated="handleTaskUpdated"
        @task-deleted="handleTaskDeleted"
        @show-toast="showToast"
      />

      <!-- Gestión de Clientes -->
      <clients-management 
        v-else-if="activeTab === 'clients'"
        :clients="clients"
        @client-created="handleClientCreated"
        @client-updated="handleClientUpdated"
        @show-toast="showToast"
      />

      <!-- Configuración -->
      <system-configuration 
        v-else-if="activeTab === 'config'"
        :task-types="taskTypes"
        :billing-areas="billingAreas"
        @task-type-added="handleTaskTypeAdded"
        @task-type-removed="handleTaskTypeRemoved"
        @billing-area-added="handleBillingAreaAdded"
        @billing-area-removed="handleBillingAreaRemoved"
        @show-toast="showToast"
      />

      <!-- Reportes -->
      <reports-dashboard 
        v-else-if="activeTab === 'reports'"
        :available-reports="availableReports"
        @generate-report="handleGenerateReport"
        @show-toast="showToast"
      />
    </div>

    <!-- Toast Component -->
    <toast-notification 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Components
import SupervisorHeader from '@/components/supervisor/SupervisorHeader.vue'
import SupervisorTabs from '@/components/supervisor/SupervisorTabs.vue'
import SupervisorDashboard from '@/components/supervisor/SupervisorDashboard.vue'
import TasksManagement from '@/components/supervisor/TasksManagement.vue'
import ClientsManagement from '@/components/supervisor/ClientsManagement.vue'
import SystemConfiguration from '@/components/supervisor/SystemConfiguration.vue'
import ReportsDashboard from '@/components/supervisor/ReportsDashboard.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'

export default {
  name: 'SupervisorView',
  components: {
    SupervisorHeader,
    SupervisorTabs,
    SupervisorDashboard,
    TasksManagement,
    ClientsManagement,
    SystemConfiguration,
    ReportsDashboard,
    ToastNotification
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // State
    const activeTab = ref('dashboard')
    const loadingTasks = ref(false)
    
    // Mock Data (en producción vendrá de supervisorService)
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
      { 
        id: 1, 
        title: 'Instalación POS - Sucursal Centro', 
        technician: 'Ana Técnico', 
        technicianId: 1,
        client: 'Retail ABC', 
        clientId: 1,
        date: '2025-01-13', 
        status: 'ENEJECUCION', 
        priority: 'Alta' 
      },
      { 
        id: 2, 
        title: 'Mantención Red - Oficina Principal', 
        technician: 'Carlos López', 
        technicianId: 2,
        client: 'Empresa XYZ', 
        clientId: 2,
        date: '2025-01-13', 
        status: 'ASIGNADA', 
        priority: 'Media' 
      }
    ])
    
    const clients = ref([
      { id: 1, name: 'Retail ABC', rut: '76.123.456-7', locations: 12, activeTasks: 3 },
      { id: 2, name: 'Empresa XYZ', rut: '96.789.123-4', locations: 5, activeTasks: 2 }
    ])
    
    const taskTypes = ref([
      { id: 1, name: 'Instalación POS' },
      { id: 2, name: 'Mantención Preventiva' },
      { id: 3, name: 'Soporte en Sitio' }
    ])
    
    const billingAreas = ref([
      { id: 1, name: 'Retail - Tiendas' },
      { id: 2, name: 'Corporativo - Oficinas' }
    ])
    
    const availableReports = ref([
      { id: 1, name: 'Productividad Técnicos', description: 'Rendimiento por técnico', icon: 'fas fa-chart-bar' },
      { id: 2, name: 'Tareas por Cliente', description: 'Resumen por cliente', icon: 'fas fa-building' }
    ])
    
    // Toast
    const toast = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Computed
    const userName = computed(() => userStore.userName)
    const userRole = computed(() => userStore.userRole)

    // Methods
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

    // Event Handlers
    const handleTaskCreated = (task) => {
      tasks.value.push(task)
      showToast('Tarea creada correctamente', 'success')
    }

    const handleTaskUpdated = (updatedTask) => {
      const index = tasks.value.findIndex(t => t.id === updatedTask.id)
      if (index > -1) {
        tasks.value[index] = updatedTask
        showToast('Tarea actualizada correctamente', 'success')
      }
    }

    const handleTaskDeleted = (taskId) => {
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index > -1) {
        tasks.value.splice(index, 1)
        showToast('Tarea eliminada correctamente', 'success')
      }
    }

    const handleClientCreated = (client) => {
      clients.value.push(client)
      showToast('Cliente creado correctamente', 'success')
    }

    const handleClientUpdated = (updatedClient) => {
      const index = clients.value.findIndex(c => c.id === updatedClient.id)
      if (index > -1) {
        clients.value[index] = updatedClient
        showToast('Cliente actualizado correctamente', 'success')
      }
    }

    const handleTaskTypeAdded = (taskType) => {
      taskTypes.value.push(taskType)
      showToast('Tipo de tarea agregado correctamente', 'success')
    }

    const handleTaskTypeRemoved = (taskTypeId) => {
      const index = taskTypes.value.findIndex(t => t.id === taskTypeId)
      if (index > -1) {
        taskTypes.value.splice(index, 1)
        showToast('Tipo de tarea eliminado', 'success')
      }
    }

    const handleBillingAreaAdded = (billingArea) => {
      billingAreas.value.push(billingArea)
      showToast('Área de cobro agregada correctamente', 'success')
    }

    const handleBillingAreaRemoved = (billingAreaId) => {
      const index = billingAreas.value.findIndex(a => a.id === billingAreaId)
      if (index > -1) {
        billingAreas.value.splice(index, 1)
        showToast('Área de cobro eliminada', 'success')
      }
    }

    const handleGenerateReport = (report) => {
      showToast(`Generando reporte: ${report.name}`, 'info')
      // Integrar con supervisorService.generateReport()
    }

    const logout = async () => {
      await userStore.logout()
      router.push('/login')
    }

    // Lifecycle
    onMounted(async () => {
      console.log('Vista de Supervisor cargada')
      // Aquí cargar datos reales:
      // stats.value = await supervisorService.getStats()
      // technicians.value = await supervisorService.getTechnicians()
      // tasks.value = await supervisorService.getTasks()
      // etc.
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
      toast,
      
      // Computed
      userName,
      userRole,
      
      // Methods
      logout,
      handleTaskCreated,
      handleTaskUpdated,
      handleTaskDeleted,
      handleClientCreated,
      handleClientUpdated,
      handleTaskTypeAdded,
      handleTaskTypeRemoved,
      handleBillingAreaAdded,
      handleBillingAreaRemoved,
      handleGenerateReport,
      showToast
    }
  }
}
</script>