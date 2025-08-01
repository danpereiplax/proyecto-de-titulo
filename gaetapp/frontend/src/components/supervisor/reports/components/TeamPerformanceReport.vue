<!-- frontend/src/components/supervisor/reports/components/TeamPerformanceReport.vue -->
<template>
  <div class="p-6 bg-white border rounded-lg">
    <h4 class="mb-4 text-lg font-medium text-gray-900">Rendimiento del Equipo</h4>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div class="text-center">
        <div class="flex items-center justify-center w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-full">
          <i class="text-2xl text-blue-600 fas fa-users"></i>
        </div>
        <h5 class="font-medium text-gray-900">Colaboración</h5>
        <p class="text-sm text-gray-500">Trabajo en equipo excelente</p>
        <p class="mt-2 text-2xl font-bold text-blue-600">92%</p>
      </div>
      <div class="text-center">
        <div class="flex items-center justify-center w-20 h-20 mx-auto mb-3 bg-green-100 rounded-full">
          <i class="text-2xl text-green-600 fas fa-target"></i>
        </div>
        <h5 class="font-medium text-gray-900">Objetivos</h5>
        <p class="text-sm text-gray-500">Metas mensuales cumplidas</p>
        <p class="mt-2 text-2xl font-bold text-green-600">89%</p>
      </div>
      <div class="text-center">
        <div class="flex items-center justify-center w-20 h-20 mx-auto mb-3 bg-purple-100 rounded-full">
          <i class="text-2xl text-purple-600 fas fa-chart-line"></i>
        </div>
        <h5 class="font-medium text-gray-900">Mejora</h5>
        <p class="text-sm text-gray-500">Crecimiento vs mes anterior</p>
        <p class="mt-2 text-2xl font-bold text-purple-600">+15%</p>
      </div>
    </div>

    <!-- Team Goals Progress -->
    <div class="mt-8">
      <h5 class="mb-4 font-medium text-gray-900">Progreso de Objetivos del Equipo</h5>
      <div class="space-y-4">
        <div v-for="goal in teamGoals" :key="goal.name" class="flex items-center">
          <div class="w-48 text-sm font-medium text-gray-900">{{ goal.name }}</div>
          <div class="flex-1 mx-4">
            <div class="h-3 bg-gray-200 rounded-full">
              <div 
                :class="getGoalProgressClass(goal.progress)"
                class="h-3 transition-all duration-500 rounded-full"
                :style="{ width: goal.progress + '%' }"
              ></div>
            </div>
          </div>
          <div class="w-16 text-sm text-gray-600">{{ goal.progress }}%</div>
          <div class="w-20 text-xs text-gray-500">{{ goal.target }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamPerformanceReport',
  data() {
    return {
      teamGoals: [
        { name: 'Tareas Completadas', progress: 94, target: '150/160' },
        { name: 'Satisfacción Cliente', progress: 89, target: '4.5/5.0' },
        { name: 'Tiempo Respuesta', progress: 76, target: '< 2h' },
        { name: 'Eficiencia Operativa', progress: 88, target: '85%' }
      ]
    }
  },
  methods: {
    getGoalProgressClass(progress) {
      if (progress >= 90) return 'bg-green-500'
      if (progress >= 80) return 'bg-blue-500'
      if (progress >= 70) return 'bg-yellow-500'
      return 'bg-red-500'
    }
  }
}
</script>

<style scoped>
/* Animaciones suaves */
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Efectos hover mejorados */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mejoras para iconos */
.fas {
  transition: transform 0.2s ease;
}

button:hover .fas {
  transform: scale(1.1);
}

/* Animaciones para barras de progreso */
.h-3 {
  transition: width 0.8s ease-in-out;
}
</style>