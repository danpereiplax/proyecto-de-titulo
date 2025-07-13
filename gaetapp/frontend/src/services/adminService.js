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
      // Retornar datos de ejemplo desde localStorage si falla la API
      const savedUser = localStorage.getItem('gaet_user')
      const mockUsers = []
      
      if (savedUser) {
        const user = JSON.parse(savedUser)
        mockUsers.push({
          id: 1,
          rut_persona: user.rut?.split('-')[0] || '12345678',
          rut_dv_persona: user.rut?.split('-')[1] || '9',
          nombre_persona: user.nombre || 'Administrador',
          apellido_paterno_persona: user.apellido || 'Sistema',
          email_corporativo: user.email || 'admin@infomaxis.cl',
          perfil: user.perfil || 'ADMINISTRADOR',
          activo: true,
          username: user.username || 'admin',
          fecha_ingreso: new Date().toISOString()
        })
      }
      
      // Agregar usuarios de ejemplo
      mockUsers.push(
        {
          id: 2,
          rut_persona: '11223344',
          rut_dv_persona: '5',
          nombre_persona: 'Carlos',
          apellido_paterno_persona: 'Supervisor',
          email_corporativo: 'carlos@infomaxis.cl',
          perfil: 'SUPERVISOR',
          activo: true,
          username: 'carlos.supervisor',
          fecha_ingreso: new Date().toISOString()
        },
        {
          id: 3,
          rut_persona: '22334455',
          rut_dv_persona: '6',
          nombre_persona: 'Ana',
          apellido_paterno_persona: 'Técnico',
          email_corporativo: 'ana.tecnico@infomaxis.cl',
          perfil: 'TECNICO',
          activo: true,
          username: 'ana.tecnico',
          fecha_ingreso: new Date().toISOString()
        }
      )
      
      return { data: mockUsers }
    }
  },

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await apiClient.post('/api/admin/users', userData)
      return response
    } catch (error) {
      console.error('Error creando usuario:', error)
      // Simular respuesta exitosa para desarrollo
      return {
        data: {
          id: Date.now(),
          ...userData,
          fecha_ingreso: new Date().toISOString()
        }
      }
    }
  },

  // Actualizar usuario existente
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}`, userData)
      return response
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      // Simular respuesta exitosa para desarrollo
      return {
        data: {
          id: userId,
          ...userData
        }
      }
    }
  },

  // Cambiar estado de usuario (activar/desactivar)
  async toggleUserStatus(userId) {
    try {
      const response = await apiClient.patch(`/api/admin/users/${userId}/toggle-status`)
      return response
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error)
      // Simular respuesta exitosa para desarrollo
      return {
        data: { success: true }
      }
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