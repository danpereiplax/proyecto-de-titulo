<!-- frontend/src/components/supervisor/reports/components/TimeAnalysisReport.vue -->
<template>
  <div>
    <!-- Time Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900">Tiempo Promedio</h4>
        <p class="text-2xl font-bold text-blue-600">{{ data.averageCompletionTime }}h</p>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-green-900">A Tiempo</h4>
        <p class="text-2xl font-bold text-green-600">{{ data.onTimeCompletion }}%</p>
      </div>
      <div class="bg-red-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-red-900">Retrasadas</h4>
        <p class="text-2xl font-bold text-red-600">{{ data.delayedTasks }}</p>
      </div>
    </div>
    
    <!-- Task Types Analysis -->
    <div class="bg-white border rounded-lg p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">Análisis por Tipo de Tarea</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Tarea</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo Promedio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% A Tiempo</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="taskType in data.taskTypes" :key="taskType.type">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ taskType.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ taskType.avgTime }}h</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getOnTimeClass(taskType.onTime)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ taskType.onTime }}%
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
  name: 'TimeAnalysisReport',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    getOnTimeClass(onTime) {
      if (onTime >= 90) return 'bg-green-100 text-green-800'
      if (onTime >= 80) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }
  }
}
</script>
