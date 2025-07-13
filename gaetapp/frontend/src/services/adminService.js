// frontend/src/services/adminService.js
import apiClient from '@/utils/apiClient'

const adminService = {
  // Estadísticas del dashboard
  async getStats() {
    try {
      const response = await apiClient.get('/api/admin/stats')
      return response
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  },

  // Obtener todos los usuarios
  async getUsers() {
    try {
      const response = await apiClient.get('/api/admin/users')
      return response
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw error
    }
  },

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await apiClient.post('/api/admin/users', userData)
      return response
    } catch (error) {
      console.error('Error creando usuario:', error)
      throw error
    }
  },

  // Actualizar usuario existente
  async updateUser(rut, userData) {
    try {
      const response = await apiClient.put(`/api/admin/users/${rut}`, userData)
      return response
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  },

  // Cambiar estado de usuario (activar/desactivar)
  async toggleUserStatus(rut) {
    try {
      const response = await apiClient.patch(`/api/admin/users/${rut}/toggle-status`)
      return response
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error)
      throw error
    }
  },

  // Obtener actividad reciente
  async getActivity() {
    try {
      const response = await apiClient.get('/api/admin/activity')
      return response
    } catch (error) {
      console.error('Error obteniendo actividad:', error)
      // Retornar datos mock si falla
      return {
        data: [
          {
            id: 1,
            description: 'Sistema iniciado correctamente',
            timestamp: new Date().toISOString(),
            icon: 'fas fa-power-off'
          },
          {
            id: 2,
            description: 'Usuario administrador conectado',
            timestamp: new Date(Date.now() - 30000).toISOString(),
            icon: 'fas fa-user-shield'
          }
        ]
      }
    }
  },

  // Obtener tipos de tarea
  async getTaskTypes() {
    try {
      const response = await apiClient.get('/api/admin/task-types')
      return response
    } catch (error) {
      console.error('Error obteniendo tipos de tarea:', error)
      throw error
    }
  },

  // Crear tipo de tarea
  async createTaskType(typeData) {
    try {
      const response = await apiClient.post('/api/admin/task-types', typeData)
      return response
    } catch (error) {
      console.error('Error creando tipo de tarea:', error)
      throw error
    }
  },

  // Obtener estados de tarea
  async getTaskStates() {
    try {
      const response = await apiClient.get('/api/admin/task-states')
      return response
    } catch (error) {
      console.error('Error obteniendo estados de tarea:', error)
      throw error
    }
  },

  // Obtener áreas de cobro
  async getBillingAreas() {
    try {
      const response = await apiClient.get('/api/admin/billing-areas')
      return response
    } catch (error) {
      console.error('Error obteniendo áreas de cobro:', error)
      throw error
    }
  },

  // Obtener clientes
  async getClients() {
    try {
      const response = await apiClient.get('/api/admin/clients')
      return response
    } catch (error) {
      console.error('Error obteniendo clientes:', error)
      throw error
    }
  }
}

export default adminService