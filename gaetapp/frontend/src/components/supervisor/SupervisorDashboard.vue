<!-- frontend/src/components/supervisor/SupervisorDashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="text-2xl text-blue-500 fas fa-tasks"></i>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tareas Activas</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.activeTasks }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="text-2xl text-yellow-500 fas fa-clock"></i>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.pendingTasks }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="text-2xl text-green-500 fas fa-check-circle"></i>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Completadas Hoy</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.completedToday }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="text-2xl text-purple-500 fas fa-users"></i>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Técnicos Activos</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.activeTechnicians }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Técnicos Status -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Estado de Técnicos</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="tech in technicians" :key="tech.id" class="p-4 rounded-lg bg-gray-50">
            <div class="flex items-center">
              <div class="flex-shrink-0 w-10 h-10">
                <div class="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-full">
                  <i class="text-blue-600 fas fa-user"></i>
                </div>
              </div>
              <div class="flex-1 ml-4">
                <div class="text-sm font-medium text-gray-900">{{ tech.name }}</div>
                <div class="text-sm text-gray-500">{{ tech.tasksAssigned }} tareas asignadas</div>
              </div>
              <div class="flex-shrink-0">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  tech.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ tech.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupervisorDashboard',
  props: {
    stats: {
      type: Object,
      required: true
    },
    technicians: {
      type: Array,
      required: true
    }
  }
}
</script>