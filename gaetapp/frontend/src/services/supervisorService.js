// frontend/src/services/supervisorService.js

import apiClient from './apiClient'

/**
 * Servicio para todas las operaciones del Supervisor
 * Integra con los endpoints del backend según backcom.md
 */
class SupervisorService {
  
  // ========================
  // DASHBOARD & STATS
  // ========================
  
  /**
   * Obtiene estadísticas del dashboard
   */
  async getStats() {
    try {
      const response = await apiClient.get('/supervisor/stats')
      return {
        activeTasks: response.data.activeTasks || 0,
        pendingTasks: response.data.pendingTasks || 0,
        completedToday: response.data.completedToday || 0,
        activeTechnicians: response.data.activeTechnicians || 0
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      // Fallback con datos mock
      return {
        activeTasks: 12,
        pendingTasks: 5,
        completedToday: 8,
        activeTechnicians: 3
      }
    }
  }

  // ========================
  // GESTIÓN DE TÉCNICOS
  // ========================
  
  /**
   * Obtiene lista de técnicos activos
   */
  async getTechnicians() {
    try {
      // Usar endpoint de usuarios con filtro por perfil TECNICO
      const response = await apiClient.get('/admin/users?perfil=TECNICO')
      
      return response.data.map(user => ({
        id: user.rut_persona,
        name: `${user.nombres} ${user.apellidos}`,
        email: user.email,
        username: user.username,
        active: user.activo,
        tasksAssigned: 0, // Se podría calcular desde tareas
        status: user.activo ? 'Disponible' : 'Inactivo'
      }))
    } catch (error) {
      console.error('Error obteniendo técnicos:', error)
      return this.getMockTechnicians()
    }
  }

  getMockTechnicians() {
    return [
      { id: 1, name: 'Ana Técnico', tasksAssigned: 4, status: 'En Terreno', active: true },
      { id: 2, name: 'Carlos López', tasksAssigned: 3, status: 'Disponible', active: true },
      { id: 3, name: 'María González', tasksAssigned: 5, status: 'En Terreno', active: true }
    ]
  }

  // ========================
  // GESTIÓN DE TAREAS
  // ========================
  
  /**
   * Obtiene todas las tareas
   */
  async getTasks(filters = {}) {
    try {
      let url = '/tarea'
      const params = new URLSearchParams()
      
      if (filters.status) params.append('estado', filters.status)
      if (filters.technician) params.append('tecnico', filters.technician)
      if (filters.client) params.append('cliente', filters.client)
      if (filters.date) params.append('fecha', filters.date)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await apiClient.get(url)
      
      return response.data.map(tarea => ({
        id: tarea.id_tarea,
        title: tarea.titulo || `Tarea ${tarea.id_tarea}`,
        description: tarea.descripcion,
        status: tarea.estado_tarea,
        priority: tarea.prioridad || 'Media',
        date: tarea.fecha_programada,
        technicianId: tarea.rut_tecnico,
        technician: tarea.nombre_tecnico,
        clientId: tarea.id_cliente,
        client: tarea.nombre_cliente,
        location: tarea.direccion_cliente
      }))
    } catch (error) {
      console.error('Error obteniendo tareas:', error)
      return this.getMockTasks()
    }
  }

  getMockTasks() {
    return [
      {
        id: 1,
        title: 'Instalación POS - Sucursal Centro',
        technician: 'Ana Técnico',
        technicianId: 1,
        client: 'Retail ABC',
        clientId: 1,
        date: '2025-01-13',
        status: 'ENEJECUCION',
        priority: 'Alta'
      },
      {
        id: 2,
        title: 'Mantención Red - Oficina Principal',
        technician: 'Carlos López',
        technicianId: 2,
        client: 'Empresa XYZ',
        clientId: 2,
        date: '2025-01-13',
        status: 'ASIGNADA',
        priority: 'Media'
      }
    ]
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(taskData) {
    try {
      const payload = {
        titulo: taskData.title,
        descripcion: taskData.description,
        id_tipo_tarea: taskData.typeId || 1,
        id_estado_tarea: this.getStatusId(taskData.status),
        rut_tecnico_asignado: taskData.technicianId,
        id_cliente: taskData.clientId,
        fecha_programada: taskData.date,
        prioridad: taskData.priority
      }
      
      const response = await apiClient.post('/tarea', payload)
      return {
        ...taskData,
        id: response.data.id_tarea
      }
    } catch (error) {
      console.error('Error creando tarea:', error)
      throw new Error('No se pudo crear la tarea')
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(taskId, taskData) {
    try {
      const payload = {
        titulo: taskData.title,
        descripcion: taskData.description,
        id_estado_tarea: this.getStatusId(taskData.status),
        rut_tecnico_asignado: taskData.technicianId,
        id_cliente: taskData.clientId,
        fecha_programada: taskData.date,
        prioridad: taskData.priority
      }
      
      await apiClient.put(`/tarea/${taskId}`, payload)
      return taskData
    } catch (error) {
      console.error('Error actualizando tarea:', error)
      throw new Error('No se pudo actualizar la tarea')
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(taskId) {
    try {
      await apiClient.delete(`/tarea/${taskId}`)
      return true
    } catch (error) {
      console.error('Error eliminando tarea:', error)
      throw new Error('No se pudo eliminar la tarea')
    }
  }

  /**
   * Asigna una tarea a un técnico
   */
  async assignTask(taskId, technicianId) {
    try {
      await apiClient.put(`/tarea/${taskId}`, {
        rut_tecnico_asignado: technicianId,
        id_estado_tarea: 1, // ASIGNADA
        fecha_asignacion: new Date().toISOString()
      })
      return true
    } catch (error) {
      console.error('Error asignando tarea:', error)
      throw new Error('No se pudo asignar la tarea')
    }
  }

  // ========================
  // GESTIÓN DE CLIENTES
  // ========================
  
  /**
   * Obtiene todos los clientes
   */
  async getClients() {
    try {
      const response = await apiClient.get('/cliente')
      
      return response.data.map(cliente => ({
        id: cliente.id_cliente,
        name: cliente.razon_social,
        rut: cliente.rut_cliente,
        email: cliente.email,
        phone: cliente.telefono,
        address: cliente.direccion,
        locations: cliente.total_locales || 0,
        activeTasks: cliente.tareas_activas || 0
      }))
    } catch (error) {
      console.error('Error obteniendo clientes:', error)
      return this.getMockClients()
    }
  }

  getMockClients() {
    return [
      { id: 1, name: 'Retail ABC', rut: '76.123.456-7', locations: 12, activeTasks: 3 },
      { id: 2, name: 'Empresa XYZ', rut: '96.789.123-4', locations: 5, activeTasks: 2 }
    ]
  }

  /**
   * Crea un nuevo cliente
   */
  async createClient(clientData) {
    try {
      const payload = {
        razon_social: clientData.name,
        rut_cliente: clientData.rut,
        email: clientData.email,
        telefono: clientData.phone,
        direccion: clientData.address,
        observaciones: clientData.notes
      }
      
      const response = await apiClient.post('/cliente', payload)
      return {
        ...clientData,
        id: response.data.id_cliente
      }
    } catch (error) {
      console.error('Error creando cliente:', error)
      throw new Error('No se pudo crear el cliente')
    }
  }

  /**
   * Actualiza un cliente existente
   */
  async updateClient(clientId, clientData) {
    try {
      const payload = {
        razon_social: clientData.name,
        rut_cliente: clientData.rut,
        email: clientData.email,
        telefono: clientData.phone,
        direccion: clientData.address,
        observaciones: clientData.notes
      }
      
      await apiClient.put(`/cliente/${clientId}`, payload)
      return clientData
    } catch (error) {
      console.error('Error actualizando cliente:', error)
      throw new Error('No se pudo actualizar el cliente')
    }
  }

  // ========================
  // CONFIGURACIÓN DEL SISTEMA
  // ========================
  
  /**
   * Obtiene tipos de tarea
   */
  async getTaskTypes() {
    try {
      const response = await apiClient.get('/tipo_tarea')
      return response.data.map(tipo => ({
        id: tipo.id_tipo_tarea,
        name: tipo.descripcion_tipo_tarea
      }))
    } catch (error) {
      console.error('Error obteniendo tipos de tarea:', error)
      return [
        { id: 1, name: 'Instalación POS' },
        { id: 2, name: 'Mantención Preventiva' },
        { id: 3, name: 'Soporte en Sitio' }
      ]
    }
  }

  /**
   * Crea un nuevo tipo de tarea
   */
  async createTaskType(name) {
    try {
      const response = await apiClient.post('/tipo_tarea', {
        descripcion_tipo_tarea: name
      })
      return {
        id: response.data.id_tipo_tarea,
        name: name
      }
    } catch (error) {
      console.error('Error creando tipo de tarea:', error)
      throw new Error('No se pudo crear el tipo de tarea')
    }
  }

  /**
   * Elimina un tipo de tarea
   */
  async deleteTaskType(taskTypeId) {
    try {
      await apiClient.delete(`/tipo_tarea/${taskTypeId}`)
      return true
    } catch (error) {
      console.error('Error eliminando tipo de tarea:', error)
      throw new Error('No se pudo eliminar el tipo de tarea')
    }
  }

  /**
   * Obtiene áreas de cobro
   */
  async getBillingAreas() {
    try {
      const response = await apiClient.get('/area_cobro')
      return response.data.map(area => ({
        id: area.id_area_cobro,
        name: area.descripcion_area_cobro
      }))
    } catch (error) {
      console.error('Error obteniendo áreas de cobro:', error)
      return [
        { id: 1, name: 'Retail - Tiendas' },
        { id: 2, name: 'Corporativo - Oficinas' }
      ]
    }
  }

  /**
   * Crea una nueva área de cobro
   */
  async createBillingArea(name) {
    try {
      const response = await apiClient.post('/area_cobro', {
        descripcion_area_cobro: name
      })
      return {
        id: response.data.id_area_cobro,
        name: name
      }
    } catch (error) {
      console.error('Error creando área de cobro:', error)
      throw new Error('No se pudo crear el área de cobro')
    }
  }

  /**
   * Elimina un área de cobro
   */
  async deleteBillingArea(billingAreaId) {
    try {
      await apiClient.delete(`/area_cobro/${billingAreaId}`)
      return true
    } catch (error) {
      console.error('Error eliminando área de cobro:', error)
      throw new Error('No se pudo eliminar el área de cobro')
    }
  }

  // ========================
  // REPORTES
  // ========================
  
  /**
   * Genera un reporte específico
   */
  async generateReport(reportType, filters = {}) {
    try {
      const response = await apiClient.post('/supervisor/reports', {
        type: reportType,
        filters: filters,
        format: 'json'
      })
      return response.data
    } catch (error) {
      console.error('Error generando reporte:', error)
      return {
        message: `Reporte ${reportType} generado (modo desarrollo)`,
        data: []
      }
    }
  }

  /**
   * Obtiene reporte de productividad
   */
  async getProductivityReport(period = 'month') {
    try {
      const response = await apiClient.get(`/supervisor/reports/productivity?period=${period}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo reporte de productividad:', error)
      return { technicians: [], tasks: [], productivity: 0 }
    }
  }

  /**
   * Obtiene reporte por cliente
   */
  async getClientReport(clientId = null) {
    try {
      const url = clientId 
        ? `/supervisor/reports/client/${clientId}` 
        : '/supervisor/reports/clients'
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo reporte de cliente:', error)
      return { clients: [], tasks: [], revenue: 0 }
    }
  }

  // ========================
  // UTILIDADES INTERNAS
  // ========================
  
  /**
   * Convierte estado de tarea a ID según base de datos
   */
  getStatusId(status) {
    const statusMap = {
      'ASIGNADA': 1,
      'ENEJECUCION': 2,
      'FINALIZADA': 3,
      'CANCELADA': 4,
      'TAREA_FALLIDA': 5,
      'ELIMINADA_TECNICO': 6,
      'ELIMINADA_SUPERVISOR': 7
    }
    return statusMap[status] || 1
  }

  /**
   * Convierte ID de estado a string
   */
  getStatusString(statusId) {
    const statusMap = {
      1: 'ASIGNADA',
      2: 'ENEJECUCION',
      3: 'FINALIZADA',
      4: 'CANCELADA',
      5: 'TAREA_FALLIDA',
      6: 'ELIMINADA_TECNICO',
      7: 'ELIMINADA_SUPERVISOR'
    }
    return statusMap[statusId] || 'ASIGNADA'
  }

  /**
   * Manejo de errores unificado
   */
  handleError(error, defaultMessage = 'Error en operación') {
    console.error(defaultMessage, error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.message) {
      throw new Error(error.message)
    } else {
      throw new Error(defaultMessage)
    }
  }
}

// Exportar instancia única
export default new SupervisorService()