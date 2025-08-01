<!-- frontend/src/components/supervisor/reports/components/ProductivityReport.vue -->
<template>
  <div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900">Total Tareas</h4>
        <p class="text-2xl font-bold text-blue-600">{{ data.totalTasks }}</p>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-green-900">Completadas</h4>
        <p class="text-2xl font-bold text-green-600">{{ data.completedTasks }}</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-purple-900">Eficiencia</h4>
        <p class="text-2xl font-bold text-purple-600">{{ data.efficiency }}%</p>
      </div>
    </div>
    
    <!-- Technicians Table -->
    <div class="bg-white border rounded-lg p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">Rendimiento por Técnico</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignadas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completadas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eficiencia</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tech in data.technicians" :key="tech.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tech.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tech.assigned }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tech.completed }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getEfficiencyClass(tech.efficiency)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ tech.efficiency }}%
                </span>
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
  name: 'ProductivityReport',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    getEfficiencyClass(efficiency) {
      if (efficiency >= 90) return 'bg-green-100 text-green-800'
      if (efficiency >= 80) return 'bg-yellow-100 text-yellow-800'
      if (efficiency >= 70) return 'bg-orange-100 text-orange-800'
      return 'bg-red-100 text-red-800'
    }
  }
}
</script>

