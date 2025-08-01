<!-- frontend/src/components/supervisor/ReportsDashboard.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Reportes y Métricas</h2>
      <p class="mt-2 text-sm text-gray-700">Genera reportes operativos y de rendimiento.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="report in availableReports" :key="report.id" class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i :class="report.icon" class="text-2xl text-blue-500"></i>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ report.name }}</dt>
                <dd class="text-sm text-gray-900">{{ report.description }}</dd>
              </dl>
            </div>
          </div>
          <div class="mt-5">
            <button 
              @click="$emit('generate-report', report)" 
              class="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Generar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback si no hay reportes -->
    <div v-if="!availableReports || availableReports.length === 0" class="py-12 text-center">
      <i class="mb-4 text-4xl text-gray-300 fas fa-chart-line"></i>
      <h3 class="mb-2 text-lg font-medium text-gray-900">No hay reportes configurados</h3>
      <p class="text-gray-500">Los reportes aparecerán aquí cuando estén disponibles.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsDashboard',
  props: {
    availableReports: {
      type: Array,
      default: () => []
    }
  },
  emits: ['generate-report', 'show-toast'],
  mounted() {
    console.log('ReportsDashboard mounted with reports:', this.availableReports)
  }
}
</script>