<!-- frontend/src/components/supervisor/reports/components/ClientReport.vue -->
<template>
  <div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
      <div class="p-4 rounded-lg bg-blue-50">
        <h4 class="text-sm font-medium text-blue-900">Total Clientes</h4>
        <p class="text-2xl font-bold text-blue-600">{{ data.totalClients }}</p>
      </div>
      <div class="p-4 rounded-lg bg-green-50">
        <h4 class="text-sm font-medium text-green-900">Clientes Activos</h4>
        <p class="text-2xl font-bold text-green-600">{{ data.activeClients }}</p>
      </div>
      <div class="p-4 rounded-lg bg-yellow-50">
        <h4 class="text-sm font-medium text-yellow-900">Ingresos Totales</h4>
        <p class="text-2xl font-bold text-yellow-600">${{ formatCurrency(data.totalRevenue) }}</p>
      </div>
    </div>
    
    <!-- Clients Table -->
    <div class="p-6 bg-white border rounded-lg">
      <h4 class="mb-4 text-lg font-medium text-gray-900">Resumen por Cliente</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Cliente</th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tareas</th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ingresos</th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Satisfacción</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in data.clients" :key="client.name">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{{ client.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ client.tasks }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${{ formatCurrency(client.revenue) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="mr-2 text-sm text-gray-900">{{ client.satisfaction }}</span>
                  <div class="flex">
                    <i v-for="star in 5" :key="star" 
                       :class="star <= client.satisfaction ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'"
                       class="text-xs">
                    </i>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientReport',
  props: {
    data: {
      type: Object,
      required: true
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