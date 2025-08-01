<!-- frontend/src/components/supervisor/reports/components/ClientSatisfactionReport.vue -->
<template>
  <div>
    <!-- Satisfaction Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-green-50 p-4 rounded-lg text-center">
        <h4 class="text-sm font-medium text-green-900">Satisfacción General</h4>
        <p class="text-2xl font-bold text-green-600">4.6/5</p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg text-center">
        <h4 class="text-sm font-medium text-blue-900">Respuestas</h4>
        <p class="text-2xl font-bold text-blue-600">89%</p>
      </div>
      <div class="bg-yellow-50 p-4 rounded-lg text-center">
        <h4 class="text-sm font-medium text-yellow-900">Recomendación</h4>
        <p class="text-2xl font-bold text-yellow-600">92%</p>
      </div>
    </div>
    
    <!-- Recent Comments -->
    <div class="bg-white border rounded-lg p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">Comentarios Recientes</h4>
      <div class="space-y-4">
        <div v-for="comment in satisfactionData" :key="comment.id" class="border-l-4 border-blue-500 pl-4">
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400 mr-2">
              <i v-for="star in comment.rating" :key="star" class="fas fa-star text-xs"></i>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ comment.client }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ comment.comment }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatDate(comment.date) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientSatisfactionReport',
  data() {
    return {
      satisfactionData: [
        {
          id: 1,
          client: 'Retail ABC',
          rating: 5,
          comment: 'Excelente servicio, muy profesionales y puntuales.',
          date: new Date().toISOString()
        },
        {
          id: 2,
          client: 'Empresa XYZ',
          rating: 4,
          comment: 'Buen trabajo, solo pequeño retraso en la instalación.',
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          client: 'Tienda 123',
          rating: 5,
          comment: 'Superaron nuestras expectativas. Muy recomendados.',
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>