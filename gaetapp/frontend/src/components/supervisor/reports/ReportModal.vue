<!-- frontend/src/components/supervisor/reports/ReportModal.vue -->
<template>
  <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" @click="closeOnBackdrop">
    <div class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto" @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 mb-6 border-b">
        <div>
          <h3 class="text-xl font-medium text-gray-900">{{ report.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">
            Generado {{ formatDate(report.createdAt) }} • {{ report.format.toUpperCase() }} • {{ report.size }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="printReport"
            class="px-3 py-2 text-sm text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700"
          >
            <i class="mr-2 fas fa-print"></i>Imprimir
          </button>
          <button 
            @click="$emit('download', report)"
            class="px-3 py-2 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <i class="mr-2 fas fa-download"></i>Descargar
          </button>
          <button @click="$emit('close')" class="text-gray-400 transition-colors hover:text-gray-600">
            <i class="text-xl fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Report Content Component -->
      <report-content :report="report" />

      <!-- Custom Report Filters Display -->
      <div v-if="report.custom && report.filters" class="p-4 mt-6 border rounded-lg bg-gray-50">
        <h4 class="mb-3 text-sm font-medium text-gray-900">Filtros Aplicados</h4>
        <div class="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div v-if="report.filters.period">
            <span class="text-gray-600">Período:</span>
            <span class="ml-1 font-medium">{{ getPeriodName(report.filters.period) }}</span>
          </div>
          <div v-if="report.filters.technician">
            <span class="text-gray-600">Técnico:</span>
            <span class="ml-1 font-medium">{{ getTechnicianName(report.filters.technician) }}</span>
          </div>
          <div v-if="report.filters.client">
            <span class="text-gray-600">Cliente:</span>
            <span class="ml-1 font-medium">{{ getClientName(report.filters.client) }}</span>
          </div>
          <div v-if="report.filters.taskType">
            <span class="text-gray-600">Tipo:</span>
            <span class="ml-1 font-medium">{{ getTaskTypeName(report.filters.taskType) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReportContent from './ReportContent.vue'

export default {
  name: 'ReportModal',
  components: {
    ReportContent
  },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'download'],
  methods: {
    closeOnBackdrop(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close')
      }
    },
    printReport() {
      window.print()
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getPeriodName(period) {
      const names = {
        'today': 'Hoy',
        'week': 'Esta Semana',
        'month': 'Este Mes',
        'quarter': 'Este Trimestre',
        'year': 'Este Año',
        'custom': 'Personalizado'
      }
      return names[period] || period
    },
    getTechnicianName(id) {
      const technicians = {
        '1': 'Ana Técnico',
        '2': 'Carlos López',
        '3': 'María González'
      }
      return technicians[id] || `Técnico ${id}`
    },
    getClientName(id) {
      const clients = {
        '1': 'Retail ABC',
        '2': 'Empresa XYZ',
        '3': 'Tienda 123'
      }
      return clients[id] || `Cliente ${id}`
    },
    getTaskTypeName(id) {
      const types = {
        '1': 'Instalación POS',
        '2': 'Mantención',
        '3': 'Soporte',
        '4': 'Configuración'
      }
      return types[id] || `Tipo ${id}`
    }
  }
}
</script>

<style scoped>
/* Estilos para impresión */
@media print {
  .fixed {
    position: static !important;
  }
  
  .bg-gray-600 {
    background: transparent !important;
  }
  
  .shadow-lg {
    box-shadow: none !important;
  }
  
  button {
    display: none !important;
  }
  
  .border {
    border: 1px solid #e5e7eb !important;
  }
}

/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>