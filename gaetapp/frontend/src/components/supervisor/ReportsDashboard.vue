¿<!-- frontend/src/components/supervisor/ReportsDashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Reportes y Métricas</h2>
      <p class="mt-2 text-sm text-gray-700">
        Genera reportes operativos y de rendimiento para análisis detallado.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-green-500 fas fa-chart-line"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Eficiencia Promedio</p>
            <p class="text-lg font-semibold text-gray-900">84.2%</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-blue-500 fas fa-clock"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Tiempo Promedio</p>
            <p class="text-lg font-semibold text-gray-900">4.2h</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-purple-500 fas fa-check-circle"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Tareas Completadas</p>
            <p class="text-lg font-semibold text-gray-900">156</p>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white border rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="text-xl text-yellow-500 fas fa-dollar-sign"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Ingresos Est.</p>
            <p class="text-lg font-semibold text-gray-900">$2.4M</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Categories -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      
      <!-- Productivity Reports -->
      <div class="bg-white border rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <i class="mr-3 text-xl text-blue-500 fas fa-chart-bar"></i>
            <h3 class="text-lg font-medium text-gray-900">Productividad</h3>
          </div>
          
          <div class="space-y-3">
            <button 
              @click="generateReport('productivity')"
              :disabled="generatingReports.productivity"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Rendimiento por Técnico</h4>
                  <p class="text-xs text-gray-500">Eficiencia, tareas completadas, tiempo promedio</p>
                </div>
                <i v-if="generatingReports.productivity" class="text-blue-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
            
            <button 
              @click="generateReport('team-performance')"
              :disabled="generatingReports['team-performance']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Rendimiento del Equipo</h4>
                  <p class="text-xs text-gray-500">Comparativas, tendencias, objetivos</p>
                </div>
                <i v-if="generatingReports['team-performance']" class="text-blue-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
            
            <button 
              @click="generateReport('workload-analysis')"
              :disabled="generatingReports['workload-analysis']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Análisis de Carga Laboral</h4>
                  <p class="text-xs text-gray-500">Distribución de tareas, balance del equipo</p>
                </div>
                <i v-if="generatingReports['workload-analysis']" class="text-blue-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Client Reports -->
      <div class="bg-white border rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <i class="mr-3 text-xl text-green-500 fas fa-building"></i>
            <h3 class="text-lg font-medium text-gray-900">Clientes</h3>
          </div>
          
          <div class="space-y-3">
            <button 
              @click="generateReport('client-summary')"
              :disabled="generatingReports['client-summary']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Resumen por Cliente</h4>
                  <p class="text-xs text-gray-500">Tareas, facturación, satisfacción</p>
                </div>
                <i v-if="generatingReports['client-summary']" class="text-green-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
            
            <button 
              @click="generateReport('revenue-analysis')"
              :disabled="generatingReports['revenue-analysis']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Análisis de Ingresos</h4>
                  <p class="text-xs text-gray-500">Rentabilidad, tendencias, proyecciones</p>
                </div>
                <i v-if="generatingReports['revenue-analysis']" class="text-green-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
            
            <button 
              @click="generateReport('client-satisfaction')"
              :disabled="generatingReports['client-satisfaction']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Satisfacción del Cliente</h4>
                  <p class="text-xs text-gray-500">Encuestas, feedback, calificaciones</p>
                </div>
                <i v-if="generatingReports['client-satisfaction']" class="text-green-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Operational Reports -->
      <div class="bg-white border rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <i class="mr-3 text-xl text-purple-500 fas fa-cogs"></i>
            <h3 class="text-lg font-medium text-gray-900">Operaciones</h3>
          </div>
          
          <div class="space-y-3">
            <button 
              @click="generateReport('task-status')"
              :disabled="generatingReports['task-status']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Estado de Tareas</h4>
                  <p class="text-xs text-gray-500">Distribución, pendientes, completadas</p>
                </div>
                <i v-if="generatingReports['task-status']" class="text-purple-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
            
            <button 
              @click="generateReport('time-analysis')"
              :disabled="generatingReports['time-analysis']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Análisis de Tiempos</h4>
                  <p class="text-xs text-gray-500">Duración, retrasos, eficiencia</p>
                </div>
                <i v-if="generatingReports['time-analysis']" class="text-purple-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
            
            <button 
              @click="generateReport('geographic-analysis')"
              :disabled="generatingReports['geographic-analysis']"
              class="w-full p-3 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Análisis Geográfico</h4>
                  <p class="text-xs text-gray-500">Ubicaciones, rutas, optimización</p>
                </div>
                <i v-if="generatingReports['geographic-analysis']" class="text-purple-500 fas fa-spinner fa-spin"></i>
                <i v-else class="text-gray-400 fas fa-arrow-right"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Report Builder -->
    <div class="bg-white border rounded-lg shadow">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <i class="mr-3 text-xl text-yellow-500 fas fa-magic"></i>
            <h3 class="text-lg font-medium text-gray-900">Constructor de Reportes Personalizado</h3>
          </div>
          <button 
            @click="toggleCustomBuilder"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            {{ showCustomBuilder ? 'Ocultar' : 'Mostrar' }} Constructor
          </button>
        </div>
        
        <div v-if="showCustomBuilder" class="pt-4 space-y-4 border-t">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Tipo de Reporte</label>
              <select 
                v-model="customReport.type"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar tipo</option>
                <option value="productivity">Productividad</option>
                <option value="clients">Clientes</option>
                <option value="tasks">Tareas</option>
                <option value="financial">Financiero</option>
              </select>
            </div>
            
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Período</label>
              <select 
                v-model="customReport.period"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Año</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Formato</label>
              <select 
                v-model="customReport.format"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </div>
          </div>
          
          <div v-if="customReport.period === 'custom'" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Fecha Inicio</label>
              <input 
                v-model="customReport.startDate"
                type="date"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Fecha Fin</label>
              <input 
                v-model="customReport.endDate"
                type="date"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Filtros Adicionales</label>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <select 
                v-model="customReport.technician"
                class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los técnicos</option>
                <option value="1">Ana Técnico</option>
                <option value="2">Carlos López</option>
                <option value="3">María González</option>
              </select>
              
              <select 
                v-model="customReport.client"
                class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los clientes</option>
                <option value="1">Retail ABC</option>
                <option value="2">Empresa XYZ</option>
              </select>
              
              <select 
                v-model="customReport.taskType"
                class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="1">Instalación POS</option>
                <option value="2">Mantención</option>
                <option value="3">Soporte</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="generateCustomReport"
              :disabled="!canGenerateCustomReport || generatingCustomReport"
              class="px-6 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="generatingCustomReport" class="mr-2 fas fa-spinner fa-spin"></i>
              <i v-else class="mr-2 fas fa-magic"></i>
              {{ generatingCustomReport ? 'Generando...' : 'Generar Reporte Personalizado' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="bg-white border rounded-lg shadow">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Reportes Recientes</h3>
          <button 
            @click="refreshRecentReports"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            <i class="mr-1 fas fa-sync-alt"></i>Actualizar
          </button>
        </div>
        
        <div v-if="recentReports.length === 0" class="py-8 text-center text-gray-500">
          <i class="mb-2 text-3xl fas fa-file-alt"></i>
          <p>No hay reportes generados aún</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="report in recentReports" 
            :key="report.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex items-center">
              <i :class="getReportIcon(report.type)" class="mr-3 text-lg"></i>
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ report.name }}</h4>
                <p class="text-xs text-gray-500">
                  Generado {{ formatDate(report.createdAt) }} • {{ report.format.toUpperCase() }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="downloadReport(report)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                <i class="mr-1 fas fa-download"></i>Descargar
              </button>
              <button 
                @click="viewReport(report)"
                class="text-sm text-green-600 hover:text-green-800"
              >
                <i class="mr-1 fas fa-eye"></i>Ver
              </button>
              <button 
                @click="deleteReport(report)"
                class="text-sm text-red-600 hover:text-red-800"
              >
                <i class="mr-1 fas fa-trash"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <report-modal
      v-if="showReportModal"
      :report="currentReport"
      @close="showReportModal = false"
      @download="downloadReport"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ReportModal from './reports/ReportModal.vue'
import supervisorService from '@/services/supervisorService'

export default {
  name: 'ReportsDashboard',
  components: {
    ReportModal
  },
  props: {
    availableReports: {
      type: Array,
      default: () => []
    }
  },
  emits: ['generate-report', 'show-toast'],
  setup(props, { emit }) {
    // State
    const showCustomBuilder = ref(false)
    const showReportModal = ref(false)
    const currentReport = ref(null)
    const generatingReports = ref({})
    const generatingCustomReport = ref(false)
    
    const customReport = ref({
      type: '',
      period: 'month',
      format: 'pdf',
      startDate: '',
      endDate: '',
      technician: '',
      client: '',
      taskType: ''
    })
    
    const recentReports = ref([
      {
        id: 1,
        name: 'Productividad Técnicos - Enero 2025',
        type: 'productivity',
        format: 'pdf',
        createdAt: new Date().toISOString(),
        size: '245 KB'
      },
      {
        id: 2,
        name: 'Resumen Clientes - Diciembre 2024',
        type: 'clients',
        format: 'excel',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        size: '1.2 MB'
      }
    ])

    // Computed
    const canGenerateCustomReport = computed(() => {
      return customReport.value.type && customReport.value.period && customReport.value.format
    })

    // Methods
    const toggleCustomBuilder = () => {
      showCustomBuilder.value = !showCustomBuilder.value
    }

    const generateReport = async (reportType) => {
      generatingReports.value[reportType] = true
      
      try {
        let reportData
        
        switch (reportType) {
          case 'productivity':
            reportData = await supervisorService.generateProductivityReport()
            break
          case 'client-summary':
            reportData = await supervisorService.generateClientReport()
            break
          case 'task-status':
            reportData = await supervisorService.generateTaskStatusReport()
            break
          case 'time-analysis':
            reportData = await supervisorService.generateTimeAnalysisReport()
            break
          default:
            reportData = { message: `Reporte ${reportType} generado correctamente` }
        }
        
        emit('show-toast', `Reporte ${getReportName(reportType)} generado correctamente`, 'success')
        
        // Add to recent reports
        const newReport = {
          id: Date.now(),
          name: `${getReportName(reportType)} - ${new Date().toLocaleDateString('es-CL')}`,
          type: reportType,
          format: 'pdf',
          createdAt: new Date().toISOString(),
          size: '156 KB',
          data: reportData
        }
        
        recentReports.value.unshift(newReport)
        
        // Show report modal
        currentReport.value = newReport
        showReportModal.value = true
        
      } catch (error) {
        console.error('Error generating report:', error)
        emit('show-toast', 'Error al generar el reporte', 'error')
      } finally {
        generatingReports.value[reportType] = false
      }
    }

    const generateCustomReport = async () => {
      generatingCustomReport.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const reportName = `Reporte Personalizado - ${customReport.value.type} - ${new Date().toLocaleDateString('es-CL')}`
        
        const newReport = {
          id: Date.now(),
          name: reportName,
          type: customReport.value.type,
          format: customReport.value.format,
          createdAt: new Date().toISOString(),
          size: '324 KB',
          custom: true,
          filters: { ...customReport.value }
        }
        
        recentReports.value.unshift(newReport)
        emit('show-toast', 'Reporte personalizado generado correctamente', 'success')
        
        // Reset form
        customReport.value = {
          type: '',
          period: 'month',
          format: 'pdf',
          startDate: '',
          endDate: '',
          technician: '',
          client: '',
          taskType: ''
        }
        
        showCustomBuilder.value = false
        
      } catch (error) {
        console.error('Error generating custom report:', error)
        emit('show-toast', 'Error al generar el reporte personalizado', 'error')
      } finally {
        generatingCustomReport.value = false
      }
    }

    const refreshRecentReports = async () => {
      try {
        // Simulate API call to refresh reports
        emit('show-toast', 'Lista de reportes actualizada', 'info')
      } catch (error) {
        emit('show-toast', 'Error al actualizar reportes', 'error')
      }
    }

    const downloadReport = (report) => {
      // Simulate download
      emit('show-toast', `Descargando ${report.name}`, 'info')
      
      // In real implementation, this would trigger actual download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `${report.name}.${report.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const viewReport = (report) => {
      currentReport.value = report
      showReportModal.value = true
    }

    const deleteReport = (report) => {
      if (confirm(`¿Estás seguro de eliminar el reporte "${report.name}"?`)) {
        const index = recentReports.value.findIndex(r => r.id === report.id)
        if (index > -1) {
          recentReports.value.splice(index, 1)
          emit('show-toast', 'Reporte eliminado correctamente', 'success')
        }
      }
    }

    const getReportName = (type) => {
      const names = {
        'productivity': 'Productividad Técnicos',
        'team-performance': 'Rendimiento del Equipo',
        'workload-analysis': 'Análisis de Carga Laboral',
        'client-summary': 'Resumen por Cliente',
        'revenue-analysis': 'Análisis de Ingresos',
        'client-satisfaction': 'Satisfacción del Cliente',
        'task-status': 'Estado de Tareas',
        'time-analysis': 'Análisis de Tiempos',
        'geographic-analysis': 'Análisis Geográfico'
      }
      return names[type] || type
    }

    const getReportIcon = (type) => {
      const icons = {
        'productivity': 'fas fa-chart-bar text-blue-500',
        'clients': 'fas fa-building text-green-500',
        'tasks': 'fas fa-tasks text-purple-500',
        'financial': 'fas fa-dollar-sign text-yellow-500'
      }
      return icons[type] || 'fas fa-file-alt text-gray-500'
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'hace 1 día'
      if (diffDays < 7) return `hace ${diffDays} días`
      return date.toLocaleDateString('es-CL')
    }

    return {
      // State
      showCustomBuilder,
      showReportModal,
      currentReport,
      generatingReports,
      generatingCustomReport,
      customReport,
      recentReports,
      
      // Computed
      canGenerateCustomReport,
      
      // Methods
      toggleCustomBuilder,
      generateReport,
      generateCustomReport,
      refreshRecentReports,
      downloadReport,
      viewReport,
      deleteReport,
      getReportIcon,
      formatDate
    }
  }
}
</script>