// frontend/src/services/supervisorService.js - PARTE 1
import apiClient from '@/utils/apiClient'

const supervisorService = {
  // ========================================
  // DASHBOARD Y ESTADÍSTICAS
  // ========================================
  
  async getStats() {
    try {
      console.log('📊 Obteniendo estadísticas del supervisor...');
      const response = await apiClient.get('/supervisor/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  // ========================================
  // GESTIÓN DE TAREAS
  // ========================================
  
  async getTasks(filters = {}) {
    try {
      console.log('📋 Obteniendo tareas con filtros:', filters);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.technician) params.append('technician', filters.technician);
      if (filters.search) params.append('search', filters.search);
      
      const response = await apiClient.get(`/supervisor/tasks?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo tareas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las tareas');
    }
  },

  async createTask(taskData) {
    try {
      console.log('📝 Creando nueva tarea:', taskData);
      const response = await apiClient.post('/supervisor/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la tarea');
    }
  },

  async updateTask(taskId, taskData) {
    try {
      console.log(`📝 Actualizando tarea ${taskId}:`, taskData);
      const response = await apiClient.put(`/supervisor/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la tarea');
    }
  },

  async deleteTask(taskId) {
    try {
      console.log(`🗑️ Eliminando tarea ${taskId}`);
      const response = await apiClient.delete(`/supervisor/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la tarea');
    }
  },

  // ========================================
  // GESTIÓN DE TÉCNICOS
  // ========================================
  
  async getTechnicians() {
    try {
      console.log('👨‍🔧 Obteniendo técnicos...');
      const response = await apiClient.get('/supervisor/technicians');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo técnicos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los técnicos');
    }
  },

  // ========================================
  // GESTIÓN DE CLIENTES
  // ========================================
  
  async getClients() {
    try {
      console.log('🏢 Obteniendo clientes...');
      const response = await apiClient.get('/supervisor/clients');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los clientes');
    }
  },

  async createClient(clientData) {
    try {
      console.log('🏢 Creando nuevo cliente:', clientData);
      const response = await apiClient.post('/supervisor/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando cliente:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el cliente');
    }
  },

  async updateClient(clientId, clientData) {
    try {
      console.log(`🏢 Actualizando cliente ${clientId}:`, clientData);
      const response = await apiClient.put(`/supervisor/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando cliente:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el cliente');
    }
  },

  // ========================================
  // DATOS AUXILIARES
  // ========================================
  
  async getTaskTypes() {
    try {
      console.log('📋 Obteniendo tipos de tarea...');
      const response = await apiClient.get('/supervisor/task-types');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo tipos de tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener tipos de tarea');
    }
  },

  async getTaskStates() {
    try {
      console.log('📊 Obteniendo estados de tarea...');
      const response = await apiClient.get('/supervisor/task-states');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estados de tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estados de tarea');
    }
  },

  async getClientLocations(clientId) {
    try {
      console.log(`📍 Obteniendo locales del cliente ${clientId}...`);
      const response = await apiClient.get(`/supervisor/client-locations/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo locales:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los locales');
    }
  },
  // ========================================
  // CONFIGURACIÓN
  // ========================================
  
  async createTaskType(taskTypeData) {
    try {
      console.log('📋 Creando tipo de tarea:', taskTypeData);
      const response = await apiClient.post('/basicas/tipo_tarea', taskTypeData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando tipo de tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el tipo de tarea');
    }
  },

  async deleteTaskType(taskTypeId) {
    try {
      console.log(`🗑️ Eliminando tipo de tarea ${taskTypeId}`);
      const response = await apiClient.delete(`/basicas/tipo_tarea/${taskTypeId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando tipo de tarea:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el tipo de tarea');
    }
  },

  // ========================================
  // REPORTES
  // ========================================
  
  async generateReport(reportType, filters = {}) {
    try {
      console.log(`📊 Generando reporte ${reportType} con filtros:`, filters);
      
      // Por ahora simulamos la generación de reportes
      // En el futuro se conectará con un endpoint real
      const mockReportData = {
        productivity: {
          efficiency: 84.2,
          avgTime: 4.2,
          completedTasks: 156,
          estimatedRevenue: 2400000
        },
        clients: {
          totalClients: 25,
          activeClients: 23,
          avgSatisfaction: 4.8,
          totalRevenue: 15600000
        },
        technicians: {
          totalTechnicians: 8,
          activeTechnicians: 7,
          avgEfficiency: 87.3,
          totalHours: 320
        }
      };

      // Simular delay de generación
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        message: 'Reporte generado exitosamente',
        data: mockReportData[reportType] || mockReportData.productivity,
        downloadUrl: `/reports/${reportType}_${Date.now()}.pdf`
      };
    } catch (error) {
      console.error('❌ Error generando reporte:', error);
      throw new Error(error.response?.data?.message || 'Error al generar el reporte');
    }
  },

  async exportReport(reportType, format = 'pdf') {
    try {
      console.log(`📥 Exportando reporte ${reportType} en formato ${format}`);
      
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: `Reporte exportado en formato ${format.toUpperCase()}`,
        downloadUrl: `/exports/${reportType}_${Date.now()}.${format}`
      };
    } catch (error) {
      console.error('❌ Error exportando reporte:', error);
      throw new Error('Error al exportar el reporte');
    }
  },

  // ========================================
  // UTILIDADES
  // ========================================
  
  formatTaskForDisplay(task) {
    return {
      ...task,
      fecha_creacion_display: this.formatDate(task.fecha_creacion),
      fecha_programada_display: this.formatDate(task.fecha_programada),
      prioridad_display: this.getPriorityLabel(task.prioridad),
      estado_display: this.getStatusLabel(task.estado)
    };
  },

  formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('es-CL', options);
  },

  getPriorityLabel(priority) {
    const priorities = {
      'ALTA': 'Alta',
      'MEDIA': 'Media',
      'BAJA': 'Baja'
    };
    return priorities[priority] || priority;
  },

  getStatusLabel(status) {
    const statuses = {
      'PENDIENTE': 'Pendiente',
      'EN_PROGRESO': 'En Progreso',
      'COMPLETADA': 'Completada',
      'CANCELADA': 'Cancelada'
    };
    return statuses[status] || status;
  },

  getPriorityClass(priority) {
    const classes = {
      'ALTA': 'bg-red-100 text-red-800',
      'MEDIA': 'bg-yellow-100 text-yellow-800',
      'BAJA': 'bg-green-100 text-green-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  },

  getStatusClass(status) {
    const classes = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800',
      'EN_PROGRESO': 'bg-blue-100 text-blue-800',
      'COMPLETADA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  },

  getTechnicianStatusClass(status) {
    const classes = {
      'DISPONIBLE': 'bg-green-100 text-green-800',
      'EN_TERRENO': 'bg-blue-100 text-blue-800',
      'OCUPADO': 'bg-yellow-100 text-yellow-800',
      'INACTIVO': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  },

  // ========================================
  // VALIDACIONES
  // ========================================
  
  validateTaskData(taskData) {
    const errors = [];

    if (!taskData.descripcion || taskData.descripcion.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!taskData.id_tipo_tarea) {
      errors.push('Debe seleccionar un tipo de tarea');
    }

    if (!taskData.id_local_cliente) {
      errors.push('Debe seleccionar un local/cliente');
    }

    if (taskData.fecha_programada) {
      const programmedDate = new Date(taskData.fecha_programada);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (programmedDate < today) {
        errors.push('La fecha programada no puede ser anterior a hoy');
      }
    }

    return errors;
  },

  validateClientData(clientData) {
    const errors = [];

    if (!clientData.nombre || clientData.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!clientData.rut) {
      errors.push('El RUT es obligatorio');
    } else if (!this.validateRUT(clientData.rut)) {
      errors.push('El RUT no tiene un formato válido');
    }

    if (clientData.email && !this.validateEmail(clientData.email)) {
      errors.push('El email no tiene un formato válido');
    }

    return errors;
  },

  validateRUT(rut) {
    if (!rut) return false;
    
    // Remover puntos y guión
    const cleanRUT = rut.replace(/[.-]/g, '');
    
    // Verificar que tenga entre 8 y 9 caracteres
    if (cleanRUT.length < 8 || cleanRUT.length > 9) return false;
    
    // Separar número y dígito verificador
    const number = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toLowerCase();
    
    // Verificar que el número sea válido
    if (!/^\d+$/.test(number)) return false;
    
    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;
    
    for (let i = number.length - 1; i >= 0; i--) {
      sum += parseInt(number[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = sum % 11;
    const calculatedDV = remainder === 0 ? '0' : remainder === 1 ? 'k' : (11 - remainder).toString();
    
    return dv === calculatedDV;
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // ========================================
  // MÉTODOS DE FORMATO
  // ========================================
  
  formatCurrency(amount) {
    if (!amount) return '0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  },

  formatPhoneNumber(phone) {
    if (!phone) return '';
    // Formato chileno: +56 9 1234 5678
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('56')) {
      const number = cleaned.slice(2);
      return `+56 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`;
    }
    return phone;
  },

  formatRUT(rut) {
    if (!rut) return '';
    const cleaned = rut.replace(/[.-]/g, '');
    if (cleaned.length < 8) return rut;
    
    const number = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    // Agregar puntos cada 3 dígitos desde la derecha
    const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
  },

  // ========================================
  // MÉTODOS DE ESTADO Y UI
  // ========================================
  
  getTaskStatusIcon(status) {
    const icons = {
      'PENDIENTE': '⏳',
      'EN_PROGRESO': '🔄',
      'COMPLETADA': '✅',
      'CANCELADA': '❌'
    };
    return icons[status] || '❓';
  },

  getTechnicianStatusIcon(status) {
    const icons = {
      'DISPONIBLE': '🟢',
      'EN_TERRENO': '🔵',
      'OCUPADO': '🟡',
      'INACTIVO': '⚫'
    };
    return icons[status] || '❓';
  },

  getPriorityIcon(priority) {
    const icons = {
      'ALTA': '🔴',
      'MEDIA': '🟡',
      'BAJA': '🟢'
    };
    return icons[priority] || '⚪';
  },

  // ========================================
  // MÉTODOS DE FILTRADO Y BÚSQUEDA
  // ========================================
  
  filterTasks(tasks, filters) {
    let filtered = [...tasks];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.descripcion.toLowerCase().includes(search) ||
        task.cliente.toLowerCase().includes(search) ||
        task.tecnico_asignado?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(task => task.estado === filters.status);
    }

    if (filters.technician) {
      filtered = filtered.filter(task => task.rut_persona_asignada === filters.technician);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.prioridad === filters.priority);
    }

    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filtered = filtered.filter(task => new Date(task.fecha_programada) >= dateFrom);
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      filtered = filtered.filter(task => new Date(task.fecha_programada) <= dateTo);
    }

    return filtered;
  },

  // ========================================
  // MÉTODOS DE ESTADÍSTICAS
  // ========================================
  
  calculateTaskStats(tasks) {
    const total = tasks.length;
    const pending = tasks.filter(t => t.estado === 'PENDIENTE').length;
    const inProgress = tasks.filter(t => t.estado === 'EN_PROGRESO').length;
    const completed = tasks.filter(t => t.estado === 'COMPLETADA').length;
    const cancelled = tasks.filter(t => t.estado === 'CANCELADA').length;

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    };
  },

  calculateTechnicianStats(technicians) {
    const total = technicians.length;
    const active = technicians.filter(t => t.activo).length;
    const available = technicians.filter(t => t.estado === 'DISPONIBLE').length;
    const busy = technicians.filter(t => t.estado === 'EN_TERRENO').length;

    return {
      total,
      active,
      available,
      busy,
      utilization: active > 0 ? ((busy / active) * 100).toFixed(1) : 0
    };
  }
};

export default supervisorService;