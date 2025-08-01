<!-- frontend/src/components/supervisor/reports/components/GenericReport.vue -->
<template>
  <div class="p-6 bg-white border rounded-lg">
    <div class="py-12 text-center">
      <i class="mb-4 text-6xl text-gray-300 fas fa-file-alt"></i>
      <h4 class="mb-2 text-lg font-medium text-gray-900">{{ report.name }}</h4>
      <p class="mb-4 text-gray-500">
        Este reporte se ha generado exitosamente y está listo para descargar.
      </p>
      
      <!-- Report Details -->
      <div class="max-w-md p-4 mx-auto mb-6 rounded-lg bg-gray-50">
        <div class="space-y-2 text-sm text-left">
          <div class="flex justify-between">
            <span class="text-gray-600">Tipo:</span>
            <span class="font-medium">{{ getReportTypeName(report.type) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Formato:</span>
            <span class="font-medium">{{ report.format.toUpperCase() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tamaño:</span>
            <span class="font-medium">{{ report.size }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Generado:</span>
            <span class="font-medium">{{ formatDate(report.createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-center space-x-3">
        <button 
          @click="$emit('download', report)"
          class="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <i class="mr-2 fas fa-download"></i>
          Descargar Reporte
        </button>
        <button 
          @click="shareReport"
          class="px-6 py-2 text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700"
        >
          <i class="mr-2 fas fa-share"></i>
          Compartir
        </button>
      </div>
      
      <!-- Sample Data Preview -->
      <div v-if="showPreview" class="mt-8 text-left">
        <h5 class="mb-3 font-medium text-gray-900">Vista Previa de Datos</h5>
        <div class="p-4 text-sm rounded-lg bg-gray-50">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-600">Registros procesados:</span>
              <span class="ml-2 font-medium">{{ Math.floor(Math.random() * 1000) + 100 }}</span>
            </div>
            <div>
              <span class="text-gray-600">Período analizado:</span>
              <span class="ml-2 font-medium">{{ getAnalysisPeriod() }}</span>
            </div>
            <div>
              <span class="text-gray-600">Última actualización:</span>
              <span class="ml-2 font-medium">{{ formatDate(new Date().toISOString()) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Estado:</span>
              <span class="ml-2 font-medium text-green-600">Completo</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        @click="showPreview = !showPreview"
        class="mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        {{ showPreview ? 'Ocultar' : 'Mostrar' }} Vista Previa
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GenericReport',
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  emits: ['download'],
  data() {
    return {
      showPreview: false
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getReportTypeName(type) {
      const names = {
        'productivity': 'Productividad',
        'team-performance': 'Rendimiento del Equipo',
        'workload-analysis': 'Análisis de Carga Laboral',
        'clients': 'Clientes',
        'client-summary': 'Resumen por Cliente',
        'revenue-analysis': 'Análisis de Ingresos',
        'client-satisfaction': 'Satisfacción del Cliente',
        'tasks': 'Tareas',
        'task-status': 'Estado de Tareas',
        'time-analysis': 'Análisis de Tiempos',
        'geographic-analysis': 'Análisis Geográfico',
        'financial': 'Financiero'
      }
      return names[type] || 'Reporte Personalizado'
    },
    getAnalysisPeriod() {
      const periods = ['Último mes', 'Últimos 3 meses', 'Último trimestre', 'Último año']
      return periods[Math.floor(Math.random() * periods.length)]
    },
    shareReport() {
      if (navigator.share) {
        navigator.share({
          title: this.report.name,
          text: `Reporte ${this.getReportTypeName(this.report.type)} generado`,
          url: window.location.href
        })
      } else {
        // Fallback - copiar al portapapeles
        navigator.clipboard.writeText(window.location.href)
        // Aquí podrías emitir un evento para mostrar un toast
        this.$emit('show-toast', 'Enlace copiado al portapapeles', 'info')
      }
    }
  }
}
</script>
