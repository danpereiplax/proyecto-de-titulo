<!-- frontend/src/components/supervisor/reports/components/RevenueAnalysisReport.vue -->
<template>
  <div>
    <!-- Revenue Summary -->
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
      <div class="p-4 rounded-lg bg-green-50">
        <h4 class="text-sm font-medium text-green-900">Ingresos Este Mes</h4>
        <p class="text-2xl font-bold text-green-600">${{ formatCurrency(1850000) }}</p>
      </div>
      <div class="p-4 rounded-lg bg-blue-50">
        <h4 class="text-sm font-medium text-blue-900">Proyección Anual</h4>
        <p class="text-2xl font-bold text-blue-600">${{ formatCurrency(24500000) }}</p>
      </div>
      <div class="p-4 rounded-lg bg-purple-50">
        <h4 class="text-sm font-medium text-purple-900">Crecimiento</h4>
        <p class="text-2xl font-bold text-purple-600">+18%</p>
      </div>
    </div>
    
    <!-- Revenue by Service Type -->
    <div class="p-6 bg-white border rounded-lg">
      <h4 class="mb-4 text-lg font-medium text-gray-900">Ingresos por Tipo de Servicio</h4>
      <div class="space-y-3">
        <div v-for="service in revenueData" :key="service.type" class="flex items-center">
          <div class="w-40 text-sm font-medium text-gray-900">{{ service.type }}</div>
          <div class="flex-1 mx-4">
            <div class="h-3 bg-gray-200 rounded-full">
              <div 
                class="h-3 transition-all duration-500 bg-green-500 rounded-full"
                :style="{ width: (service.amount / 800000 * 100) + '%' }"
              ></div>
            </div>
          </div>
          <div class="w-24 text-sm text-gray-700">${{ formatCurrency(service.amount) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevenueAnalysisReport',
  data() {
    return {
      revenueData: [
        { type: 'Instalación POS', amount: 750000 },
        { type: 'Mantención', amount: 420000 },
        { type: 'Soporte Técnico', amount: 280000 },
        { type: 'Configuración', amount: 180000 }
      ]
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
  }
}
</script>