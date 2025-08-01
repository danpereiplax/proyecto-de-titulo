<!-- frontend/src/components/supervisor/ClientsManagement.vue -->
<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h2 class="text-xl font-semibold text-gray-900">Gestión de Clientes</h2>
        <p class="mt-2 text-sm text-gray-700">Administra los clientes y sus ubicaciones.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button @click="$emit('show-toast', 'Funcionalidad próximamente', 'info')" class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
          <i class="fas fa-plus mr-2"></i>
          Nuevo Cliente
        </button>
      </div>
    </div>

    <!-- Lista de Clientes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="client in clients" :key="client.id" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-building text-blue-500 text-2xl"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ client.name }}</dt>
                <dd class="text-lg font-medium text-gray-900">{{ client.rut }}</dd>
              </dl>
            </div>
          </div>
          <div class="mt-5">
            <div class="text-sm text-gray-500">
              <p>{{ client.locations }} ubicaciones</p>
              <p>{{ client.activeTasks }} tareas activas</p>
            </div>
            <div class="mt-3 flex space-x-3">
              <button @click="$emit('show-toast', `Viendo detalles de: ${client.name}`, 'info')" class="text-sm text-blue-600 hover:text-blue-900">
                Ver detalles
              </button>
              <button @click="$emit('show-toast', `Editando cliente: ${client.name}`, 'info')" class="text-sm text-green-600 hover:text-green-900">
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientsManagement',
  props: {
    clients: {
      type: Array,
      required: true
    }
  },
  emits: ['client-created', 'client-updated', 'show-toast']
}
</script>