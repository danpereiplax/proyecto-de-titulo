// frontend/src/services/supervisorService.js
import apiClient from '@/utils/apiClient'

const supervisorService = {
  // Dashboard y estadísticas
  async getStats() {
    try {
      const response = await apiClient.get('/api/supervisor/stats')
      return response
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      // Retornar datos mock si falla
      return {
        data: {
          activeTasks: 12,
          pendingTasks: 5,
          completedToday: 8,
          activeTechnicians: 3
        }
      }
    }
  },

  // Gestión de Tareas
  async getTasks(filters = {}) {
    try {
      const response = await apiClient.get('/api/supervisor/tasks', { params: filters })
      return response
    } catch (error) {
      console.error('Error obteniendo tareas:', error)
      // Retornar datos mock si falla
      return {
        data: [
          {
            id: 1,
            title: 'Instalación POS - Sucursal Centro',
            technician: 'Ana Técnico',
            client: 'Retail ABC',
            date: '2025-01-13',
            status: 'ENEJECUCION',
            priority: 'Alta'
          },
          {
            id: 2,
            title: 'Mantención Red - Oficina Principal',
            technician: 'Carlos López',
            client: 'Empresa XYZ',
            date: '2025-01-13',
            status: 'ASIGNADA',
            priority: 'Media'
          }
        ]
      }
    }
  },

  async createTask(taskData) {
    try {
      const response = await apiClient.post('/api/supervisor/tasks', taskData)
      return response
    } catch (error) {
      console.error('Error creando tarea:', error)
      throw error
    }
  },

  async updateTask(taskId, taskData) {
    try {
      const response = await apiClient.put(`/api/supervisor/tasks/${taskId}`, taskData)
      return response
    } catch (error) {
      console.error('Error actualizando tarea:', error)
      throw error
    }
  },

  async deleteTask(taskId) {
    try {
      const response = await apiClient.delete(`/api/supervisor/tasks/${taskId}`)
      return response
    } catch (error) {
      console.error('Error eliminando tarea:', error)
      throw error
    }
  },

  async assignTask(taskId, technicianId) {
    try {
      const response = await apiClient.patch(`/api/supervisor/tasks/${taskId}/assign`, { technicianId })
      return response
    } catch (error) {
      console.error('Error asignando tarea:', error)
      throw error
    }
  },

  // Gestión de Técnicos
  async getTechnicians() {
    try {
      const response = await apiClient.get('/api/supervisor/technicians')
      return response
    } catch (error) {
      console.error('Error obteniendo técnicos:', error)
      // Retornar datos mock si falla
      return {
        data: [
          { id: 1, name: 'Ana Técnico', tasksAssigned: 4, status: 'En Terreno' },
          { id: 2, name: 'Carlos López', tasksAssigned: 3, status: 'Disponible' },
          { id: 3, name: 'María González', tasksAssigned: 5, status: 'En Terreno' }
        ]
      }
    }
  },

  // Gestión de Clientes
  async getClients() {
    try {
      const response = await apiClient.get('/api/supervisor/clients')
      return response
    } catch (error) {
      console.error('Error obteniendo clientes:', error)
      // Retornar datos mock si falla
      return {
        data: [
          { id: 1, name: 'Retail ABC', rut: '76.123.456-7', locations: 12, activeTasks: 3 },
          { id: 2, name: 'Empresa XYZ', rut: '96.789.123-4', locations: 5, activeTasks: 2 },
          { id: 3, name: 'Tienda 123', rut: '77.456.789-1', locations: 8, activeTasks: 1 }
        ]
      }
    }
  },

  async createClient(clientData) {
    try {
      const response = await apiClient.post('/api/supervisor/clients', clientData)
      return response
    } catch (error) {
      console.error('Error creando cliente:', error)
      throw error
    }
  },

  async updateClient(clientId, clientData) {
    try {
      const response = await apiClient.put(`/api/supervisor/clients/${clientId}`, clientData)
      return response
    } catch (error) {
      console.error('Error actualizando cliente:', error)
      throw error
    }
  },

  // Configuración del Sistema
  async getTaskTypes() {
    try {
      const response = await apiClient.get('/api/supervisor/task-types')
      return response
    } catch (error) {
      console.error('Error obteniendo tipos de tarea:', error)
      // Retornar datos mock si falla
      return {
        data: [
          { id: 1, name: 'Instalación POS' },
          { id: 2, name: 'Mantención Preventiva' },
          { id: 3, name: 'Soporte en Sitio' },
          { id: 4, name: 'Configuración Red' }
        ]
      }
    }
  },

  async createTaskType(typeData) {
    try {
      const response = await apiClient.post('/api/supervisor/task-types', typeData)
      return response
    } catch (error) {
      console.error('Error creando tipo de tarea:', error)
      throw error
    }
  },

  async deleteTaskType(typeId) {
    try {
      const response = await apiClient.delete(`/api/supervisor/task-types/${typeId}`)
      return response
    } catch (error) {
      console.error('Error eliminando tipo de tarea:', error)
      throw error
    }
  },

  async getBillingAreas() {
    try {
      const response = await apiClient.get('/api/supervisor/billing-areas')
      return response
    } catch (error) {
      console.error('Error obteniendo áreas de cobro:', error)
      // Retornar datos mock si falla
      return {
        data: [
          { id: 1, name: 'Retail - Tiendas' },
          { id: 2, name: 'Corporativo - Oficinas' },
          { id: 3, name: 'Mantenimiento' },
          { id: 4, name: 'Instalaciones' }
        ]
      }
    }
  },

  async createBillingArea(areaData) {
    try {
      const response = await apiClient.post('/api/supervisor/billing-areas', areaData)
      return response
    } catch (error) {
      console.error('Error creando área de cobro:', error)
      throw error
    }
  },

  async deleteBillingArea(areaId) {
    try {
      const response = await apiClient.delete(`/api/supervisor/billing-areas/${areaId}`)
      return response
    } catch (error) {
      console.error('Error eliminando área de cobro:', error)
      throw error
    }
  },

  // Reportes
  async generateReport(reportType, filters = {}) {
    try {
      const response = await apiClient.post('/api/supervisor/reports', {
        type: reportType,
        filters
      })
      return response
    } catch (error) {
      console.error('Error generando reporte:', error)
      throw error
    }
  },

  async getProductivityReport(dateRange) {
    try {
      const response = await apiClient.get('/api/supervisor/reports/productivity', {
        params: dateRange
      })
      return response
    } catch (error) {
      console.error('Error obteniendo reporte de productividad:', error)
      throw error
    }
  },

  async getClientReport(clientId, dateRange) {
    try {
      const response = await apiClient.get(`/api/supervisor/reports/client/${clientId}`, {
        params: dateRange
      })
      return response
    } catch (error) {
      console.error('Error obteniendo reporte de cliente:', error)
      throw error
    }
  }
}

export default supervisorService