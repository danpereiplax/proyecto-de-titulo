// frontend/src/services/tecnicoService.js
import apiClient from '@/utils/apiClient'

const tecnicoService = {
  // Obtener tareas asignadas al técnico
  async getMyTasks() {
    try {
      const response = await apiClient.get('/api/tecnico/tasks')
      return response
    } catch (error) {
      console.error('Error obteniendo mis tareas:', error)
      // Retornar datos mock si falla
      return {
        data: [
          {
            id: 1,
            title: 'Instalación POS Terminal 1',
            client: 'Retail ABC - Sucursal Centro',
            location: 'Av. Libertador 1234, Centro',
            date: '2025-01-13',
            time: '09:00',
            status: 'ASIGNADA',
            priority: 'Alta',
            description: 'Instalación y configuración de terminal POS en caja principal',
            photos: [],
            notes: []
          },
          {
            id: 2,
            title: 'Mantención Red Corporativa',
            client: 'Empresa XYZ',
            location: 'Torre Empresarial, Piso 15',
            date: '2025-01-13',
            time: '14:00',
            status: 'ENEJECUCION',
            priority: 'Media',
            description: 'Revisión y mantención de equipos de red corporativa',
            photos: [],
            notes: []
          }
        ]
      }
    }
  },

  // Iniciar una tarea
  async startTask(taskId) {
    try {
      const response = await apiClient.patch(`/api/tecnico/tasks/${taskId}/start`, {
        startTime: new Date().toISOString(),
        location: await getCurrentLocation()
      })
      return response
    } catch (error) {
      console.error('Error iniciando tarea:', error)
      throw error
    }
  },

  // Completar una tarea
  async completeTask(taskId, completionData) {
    try {
      const response = await apiClient.patch(`/api/tecnico/tasks/${taskId}/complete`, {
        endTime: new Date().toISOString(),
        ...completionData
      })
      return response
    } catch (error) {
      console.error('Error completando tarea:', error)
      throw error
    }
  },

  // Subir fotografía a una tarea
  async uploadPhoto(taskId, photoData) {
    try {
      const formData = new FormData()
      formData.append('photo', photoData.file)
      formData.append('description', photoData.description || '')
      formData.append('timestamp', new Date().toISOString())
      
      const response = await apiClient.post(`/api/tecnico/tasks/${taskId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response
    } catch (error) {
      console.error('Error subiendo fotografía:', error)
      throw error
    }
  },

  // Agregar nota a una tarea
  async addNote(taskId, noteContent) {
    try {
      const response = await apiClient.post(`/api/tecnico/tasks/${taskId}/notes`, {
        content: noteContent,
        timestamp: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Error agregando nota:', error)
      throw error
    }
  },

  // Obtener historial de tareas completadas
  async getTaskHistory(filters = {}) {
    try {
      const response = await apiClient.get('/api/tecnico/history', { params: filters })
      return response
    } catch (error) {
      console.error('Error obteniendo historial:', error)
      // Retornar datos mock si falla
      return {
        data: [
          {
            id: 101,
            title: 'Configuración Router WiFi',
            client: 'Café Central',
            completedDate: '2025-01-12',
            duration: '2h 30min',
            photos: 3,
            notes: 2
          },
          {
            id: 102,
            title: 'Instalación Cámaras Seguridad',
            client: 'Oficina Legal',
            completedDate: '2025-01-11',
            duration: '4h 15min',
            photos: 8,
            notes: 1
          }
        ]
      }
    }
  },

  // Obtener detalles de una tarea específica
  async getTaskDetails(taskId) {
    try {
      const response = await apiClient.get(`/api/tecnico/tasks/${taskId}`)
      return response
    } catch (error) {
      console.error('Error obteniendo detalles de tarea:', error)
      throw error
    }
  },

  // Reportar problema con una tarea
  async reportIssue(taskId, issueData) {
    try {
      const response = await apiClient.post(`/api/tecnico/tasks/${taskId}/issues`, {
        ...issueData,
        timestamp: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Error reportando problema:', error)
      throw error
    }
  },

  // Obtener estadísticas del técnico
  async getMyStats(period = 'month') {
    try {
      const response = await apiClient.get('/api/tecnico/stats', {
        params: { period }
      })
      return response
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      // Retornar datos mock si falla
      return {
        data: {
          completed: 28,
          avgTime: '2.5h',
          efficiency: 95,
          clientRating: 4.8
        }
      }
    }
  },

  // Actualizar ubicación del técnico
  async updateLocation(location) {
    try {
      const response = await apiClient.patch('/api/tecnico/location', {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Error actualizando ubicación:', error)
      throw error
    }
  },

  // Marcar llegada a una tarea
  async markArrival(taskId) {
    try {
      const location = await getCurrentLocation()
      const response = await apiClient.patch(`/api/tecnico/tasks/${taskId}/arrival`, {
        arrivalTime: new Date().toISOString(),
        location
      })
      return response
    } catch (error) {
      console.error('Error marcando llegada:', error)
      throw error
    }
  },

  // Solicitar materiales adicionales
  async requestMaterials(taskId, materials) {
    try {
      const response = await apiClient.post(`/api/tecnico/tasks/${taskId}/materials`, {
        materials,
        timestamp: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Error solicitando materiales:', error)
      throw error
    }
  },

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.patch('/api/tecnico/password', {
        currentPassword,
        newPassword
      })
      return response
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      throw error
    }
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    try {
      const response = await apiClient.patch('/api/tecnico/profile', profileData)
      return response
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
  },

  // Obtener notificaciones
  async getNotifications() {
    try {
      const response = await apiClient.get('/api/tecnico/notifications')
      return response
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error)
      return { data: [] }
    }
  },

  // Marcar notificación como leída
  async markNotificationRead(notificationId) {
    try {
      const response = await apiClient.patch(`/api/tecnico/notifications/${notificationId}/read`)
      return response
    } catch (error) {
      console.error('Error marcando notificación como leída:', error)
      throw error
    }
  }
}

// Función auxiliar para obtener ubicación actual
async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        console.warn('Error obteniendo ubicación:', error)
        // Retornar ubicación por defecto si falla
        resolve({
          latitude: -33.4489,
          longitude: -70.6693,
          accuracy: null
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    )
  })
}

export default tecnicoService