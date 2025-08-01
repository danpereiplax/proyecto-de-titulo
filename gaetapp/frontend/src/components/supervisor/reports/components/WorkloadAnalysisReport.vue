<!-- frontend/src/components/supervisor/reports/components/WorkloadAnalysisReport.vue -->
<template>
  <div class="p-6 bg-white border rounded-lg">
    <h4 class="mb-4 text-lg font-medium text-gray-900">Distribución de Carga Laboral</h4>
    <div class="space-y-4">
      <div v-for="tech in workloadData" :key="tech.name" class="flex items-center">
        <div class="w-32 text-sm font-medium text-gray-900">{{ tech.name }}</div>
        <div class="flex-1 mx-4">
          <div class="h-4 bg-gray-200 rounded-full">
            <div 
              :class="getWorkloadClass(tech.workload)"
              class="h-4 transition-all duration-500 rounded-full"
              :style="{ width: tech.workload + '%' }"
            ></div>
          </div>
        </div>
        <div class="w-16 text-sm text-gray-500">{{ tech.workload }}%</div>
        <div class="w-20 text-sm text-gray-700">{{ tech.tasks }} tareas</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkloadAnalysisReport',
  data() {
    return {
      workloadData: [
        { name: 'Ana Técnico', workload: 85, tasks: 12 },
        { name: 'Carlos López', workload: 72, tasks: 9 },
        { name: 'María González', workload: 93, tasks: 14 }
      ]
    }
  },
  methods: {
    getWorkloadClass(workload) {
      if (workload >= 90) return 'bg-red-500'
      if (workload >= 80) return 'bg-yellow-500'
      if (workload >= 60) return 'bg-blue-500'
      return 'bg-green-500'
    }
  }
}
</script>