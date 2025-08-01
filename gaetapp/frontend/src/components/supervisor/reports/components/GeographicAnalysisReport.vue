<!-- frontend/src/components/supervisor/reports/components/GeographicAnalysisReport.vue -->
<template>
  <div class="p-6 bg-white border rounded-lg">
    <h4 class="mb-4 text-lg font-medium text-gray-900">Análisis Geográfico</h4>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <h5 class="mb-3 font-medium text-gray-900">Ubicaciones Más Atendidas</h5>
        <div class="space-y-2">
          <div v-for="location in locationData" :key="location.name" class="flex items-center justify-between p-2 rounded hover:bg-gray-50">
            <div class="flex items-center">
              <i class="mr-2 text-blue-500 fas fa-map-marker-alt"></i>
              <span class="text-sm text-gray-900">{{ location.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-600">{{ location.visits }}</span>
              <span class="text-xs text-gray-400">visitas</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5 class="mb-3 font-medium text-gray-900">Métricas de Desplazamiento</h5>
        <div class="space-y-4">
          <div class="p-4 text-center rounded-lg bg-blue-50">
            <div class="mb-1 text-2xl font-bold text-blue-600">32 min</div>
            <p class="text-sm text-gray-600">Tiempo promedio entre ubicaciones</p>
          </div>
          <div class="p-4 text-center rounded-lg bg-green-50">
            <div class="mb-1 text-2xl font-bold text-green-600">15.8 km</div>
            <p class="text-sm text-gray-600">Distancia promedio por viaje</p>
          </div>
          <div class="p-4 text-center rounded-lg bg-purple-50">
            <div class="mb-1 text-2xl font-bold text-purple-600">8.5</div>
            <p class="text-sm text-gray-600">Visitas promedio por día</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Route Optimization -->
    <div class="pt-6 mt-6 border-t">
      <h5 class="mb-3 font-medium text-gray-900">Optimización de Rutas</h5>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="p-4 rounded-lg bg-yellow-50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-yellow-900">Ahorro Potencial</span>
            <i class="text-yellow-600 fas fa-route"></i>
          </div>
          <p class="text-xl font-bold text-yellow-600">18%</p>
          <p class="text-xs text-yellow-700">en tiempo de traslado</p>
        </div>
        <div class="p-4 rounded-lg bg-red-50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-red-900">Combustible</span>
            <i class="text-red-600 fas fa-gas-pump"></i>
          </div>
          <p class="text-xl font-bold text-red-600">$245k</p>
          <p class="text-xs text-red-700">gasto mensual estimado</p>
        </div>
        <div class="p-4 rounded-lg bg-indigo-50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-indigo-900">Zonas Activas</span>
            <i class="text-indigo-600 fas fa-map"></i>
          </div>
          <p class="text-xl font-bold text-indigo-600">12</p>
          <p class="text-xs text-indigo-700">áreas de cobertura</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeographicAnalysisReport',
  data() {
    return {
      locationData: [
        { name: 'Santiago Centro', visits: 45, efficiency: 'Alta' },
        { name: 'Las Condes', visits: 32, efficiency: 'Media' },
        { name: 'Providencia', visits: 28, efficiency: 'Alta' },
        { name: 'Ñuñoa', visits: 19, efficiency: 'Media' },
        { name: 'La Reina', visits: 15, efficiency: 'Baja' },
        { name: 'Vitacura', visits: 12, efficiency: 'Alta' }
      ]
    }
  }
}
</script>

<style scoped>
/* Efectos hover para las ubicaciones */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s ease;
}

/* Animaciones para las métricas */
.text-2xl {
  animation: countUp 0.8s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejoras visuales para las cards */
.bg-blue-50,
.bg-green-50,
.bg-purple-50,
.bg-yellow-50,
.bg-red-50,
.bg-indigo-50 {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.bg-blue-50:hover,
.bg-green-50:hover,
.bg-purple-50:hover,
.bg-yellow-50:hover,
.bg-red-50:hover,
.bg-indigo-50:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>