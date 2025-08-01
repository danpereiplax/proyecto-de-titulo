<!-- frontend/src/components/supervisor/SupervisorTabs.vue -->
<template>
  <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="$emit('tab-change', tab.key)"
          :class="[
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center'
          ]"
        >
          <i :class="tab.icon" class="mr-2"></i>
          {{ tab.name }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupervisorTabs',
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['tab-change'],
  data() {
    return {
      tabs: [
        { key: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-bar' },
        { key: 'tasks', name: 'Tareas', icon: 'fas fa-tasks' },
        { key: 'clients', name: 'Clientes', icon: 'fas fa-building' },
        { key: 'config', name: 'Configuración', icon: 'fas fa-cog' },
        { key: 'reports', name: 'Reportes', icon: 'fas fa-chart-line' }
      ]
    }
  }
}
</script>