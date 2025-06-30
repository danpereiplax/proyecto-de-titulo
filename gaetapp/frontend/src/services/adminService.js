// frontend/src/services/adminService.js
import apiClient from '@/utils/apiClient'

export const adminService = {
  // Dashboard Stats
  async getStats() {
    try {
      const response = await apiClient.get('/admin/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  },

  async getRecentActivity() {
    try {
      const response = await apiClient.get('/admin/activity')
      return response.data
    } catch (error) {
      console.error('Error fetching activity:', error)
      throw error
    }
  },

  // User Management
  async getUsers() {
    try {
      const response = await apiClient.get('/admin/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async getPerfiles() {
    try {
      const response = await apiClient.get('/admin/perfiles')
      return response.data
    } catch (error) {
      console.error('Error fetching perfiles:', error)
      throw error
    }
  },

  async createUser(userData) {
    try {
      const response = await apiClient.post('/admin/users', userData)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async updateUser(rutPersona, userData) {
    try {
      const response = await apiClient.put(`/admin/users/${rutPersona}`, userData)
      return response.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  async toggleUserStatus(rutPersona, activo) {
    try {
      const response = await apiClient.patch(`/admin/users/${rutPersona}/status`, { activo })
      return response.data
    } catch (error) {
      console.error('Error toggling user status:', error)
      throw error
    }
  },

  async deleteUser(rutPersona) {
    try {
      const response = await apiClient.delete(`/admin/users/${rutPersona}`)
      return response.data
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Configuration Management - Tipos de Tarea
  async getTiposTarea() {
    try {
      const response = await apiClient.get('/admin/tipos-tarea')
      return response.data
    } catch (error) {
      console.error('Error fetching tipos tarea:', error)
      throw error
    }
  },

  async createTipoTarea(tipoData) {
    try {
      const response = await apiClient.post('/admin/tipos-tarea', tipoData)
      return response.data
    } catch (error) {
      console.error('Error creating tipo tarea:', error)
      throw error
    }
  },

  async updateTipoTarea(id, tipoData) {
    try {
      const response = await apiClient.put(`/admin/tipos-tarea/${id}`, tipoData)
      return response.data
    } catch (error) {
      console.error('Error updating tipo tarea:', error)
      throw error
    }
  },

  async deleteTipoTarea(id) {
    try {
      const response = await apiClient.delete(`/admin/tipos-tarea/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting tipo tarea:', error)
      throw error
    }
  },

  // Configuration Management - Estados de Tarea
  async getEstadosTarea() {
    try {
      const response = await apiClient.get('/admin/estados-tarea')
      return response.data
    } catch (error) {
      console.error('Error fetching estados tarea:', error)
      throw error
    }
  },

  async createEstadoTarea(estadoData) {
    try {
      const response = await apiClient.post('/admin/estados-tarea', estadoData)
      return response.data
    } catch (error) {
      console.error('Error creating estado tarea:', error)
      throw error
    }
  },

  async updateEstadoTarea(id, estadoData) {
    try {
      const response = await apiClient.put(`/admin/estados-tarea/${id}`, estadoData)
      return response.data
    } catch (error) {
      console.error('Error updating estado tarea:', error)
      throw error
    }
  },

  async deleteEstadoTarea(id) {
    try {
      const response = await apiClient.delete(`/admin/estados-tarea/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting estado tarea:', error)
      throw error
    }
  },

  // Configuration Management - Áreas de Cobro
  async getAreasCobro() {
    try {
      const response = await apiClient.get('/admin/areas-cobro')
      return response.data
    } catch (error) {
      console.error('Error fetching areas cobro:', error)
      throw error
    }
  },

  async createAreaCobro(areaData) {
    try {
      const response = await apiClient.post('/admin/areas-cobro', areaData)
      return response.data
    } catch (error) {
      console.error('Error creating area cobro:', error)
      throw error
    }
  },

  async updateAreaCobro(id, areaData) {
    try {
      const response = await apiClient.put(`/admin/areas-cobro/${id}`, areaData)
      return response.data
    } catch (error) {
      console.error('Error updating area cobro:', error)
      throw error
    }
  },

  async deleteAreaCobro(id) {
    try {
      const response = await apiClient.delete(`/admin/areas-cobro/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting area cobro:', error)
      throw error
    }
  },

  // Client Management
  async getClients() {
    try {
      const response = await apiClient.get('/admin/clients')
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  },

  async createClient(clientData) {
    try {
      const response = await apiClient.post('/admin/clients', clientData)
      return response.data
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  },

  async updateClient(rutCliente, clientData) {
    try {
      const response = await apiClient.put(`/admin/clients/${rutCliente}`, clientData)
      return response.data
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  },

  async deleteClient(rutCliente) {
    try {
      const response = await apiClient.delete(`/admin/clients/${rutCliente}`)
      return response.data
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  },

  // Reports
  async generateReport(reportType, filters = {}) {
    try {
      const response = await apiClient.post(`/admin/reports/${reportType}`, filters, {
        responseType: 'blob' // Para archivos PDF/Excel
      })
      return response.data
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  },

  // System Configuration
  async getSystemConfig() {
    try {
      const response = await apiClient.get('/admin/config')
      return response.data
    } catch (error) {
      console.error('Error fetching system config:', error)
      throw error
    }
  },

  async updateSystemConfig(configData) {
    try {
      const response = await apiClient.put('/admin/config', configData)
      return response.data
    } catch (error) {
      console.error('Error updating system config:', error)
      throw error
    }
  },

  // Bulk Operations
  async bulkCreateUsers(usersData) {
    try {
      const response = await apiClient.post('/admin/users/bulk', { users: usersData })
      return response.data
    } catch (error) {
      console.error('Error bulk creating users:', error)
      throw error
    }
  },

  async exportUsers(format = 'excel') {
    try {
      const response = await apiClient.get(`/admin/users/export?format=${format}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting users:', error)
      throw error
    }
  },

  // System Logs
  async getSystemLogs(filters = {}) {
    try {
      const response = await apiClient.get('/admin/logs', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching system logs:', error)
      throw error
    }
  },

  // Backup Operations
  async createBackup() {
    try {
      const response = await apiClient.post('/admin/backup')
      return response.data
    } catch (error) {
      console.error('Error creating backup:', error)
      throw error
    }
  },

  async getBackups() {
    try {
      const response = await apiClient.get('/admin/backups')
      return response.data
    } catch (error) {
      console.error('Error fetching backups:', error)
      throw error
    }
  },

  async restoreBackup(backupId) {
    try {
      const response = await apiClient.post(`/admin/backup/${backupId}/restore`)
      return response.data
    } catch (error) {
      console.error('Error restoring backup:', error)
      throw error
    }
  }
}