<!-- frontend/src/components/supervisor/reports/components/TaskStatusReport.vue -->
<template>
  <div>
    <!-- Status Cards -->
    <div class="grid grid-cols-2 gap-4 mb-6 md:grid-cols-5">
      <div class="p-4 text-center rounded-lg bg-blue-50">
        <h4 class="text-sm font-medium text-blue-900">Asignadas</h4>
        <p class="text-2xl font-bold text-blue-600">{{ data.assigned }}</p>
      </div>
      <div class="p-4 text-center rounded-lg bg-yellow-50">
        <h4 class="text-sm font-medium text-yellow-900">En Progreso</h4>
        <p class="text-2xl font-bold text-yellow-600">{{ data.inProgress }}</p>
      </div>
      <div class="p-4 text-center rounded-lg bg-green-50">
        <h4 class="text-sm font-medium text-green-900">Completadas</h4>
        <p class="text-2xl font-bold text-green-600">{{ data.completed }}</p>
      </div>
      <div class="p-4 text-center rounded-lg bg-red-50">
        <h4 class="text-sm font-medium text-red-900">Canceladas</h4>
        <p class="text-2xl font-bold text-red-600">{{ data.cancelled }}</p>
      </div>
      <div class="p-4 text-center rounded-lg bg-gray-50">
        <h4 class="text-sm font-medium text-gray-900">Fallidas</h4>
        <p class="text-2xl font-bold text-gray-600">{{ data.failed }}</p>
      </div>
    </div>
    
    <!-- Chart Placeholder -->
    <div class="p-6 bg-white border rounded-lg">
      <h4 class="mb-4 text-lg font-medium text-gray-900">Distribución de Estados</h4>
      <div class="flex items-center justify-center h-64 rounded-lg bg-gray-50">
        <div class="text-center text-gray-500">
          <i class="mb-2 text-4xl fas fa-chart-pie"></i>
          <p>Gráfico de distribución</p>
          <p class="text-sm">(Disponible en versión completa)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskStatusReport',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>