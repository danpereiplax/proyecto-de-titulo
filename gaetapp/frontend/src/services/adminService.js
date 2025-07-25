// frontend/src/services/adminService.js
import apiClient from '@/utils/apiClient'

class AdminService {
  
  // 📊 Obtener estadísticas de usuarios
  async getStats() {
    try {
      console.log('📊 Obteniendo estadísticas de usuarios...');
      const response = await apiClient.get('/api/admin/stats');
      console.log('✅ Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw this.handleError(error);
    }
  }

  // 📋 Obtener todos los usuarios
  async getAllUsers() {
    try {
      console.log('📋 Obteniendo lista de usuarios...');
      const response = await apiClient.get('/api/admin/users');
      console.log(`✅ ${response.data.data.length} usuarios obtenidos`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      throw this.handleError(error);
    }
  }

  // 👤 Obtener usuario por RUT
  async getUserByRut(rut) {
    try {
      console.log(`👤 Obteniendo usuario RUT: ${rut}`);
      const response = await apiClient.get(`/api/admin/users/${rut}`);
      console.log('✅ Usuario obtenido:', response.data.data.nombre_persona);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      throw this.handleError(error);
    }
  }

  // ➕ Crear nuevo usuario
  async createUser(userData) {
    try {
      console.log('➕ Creando nuevo usuario:', userData.nombre_persona);
      const response = await apiClient.post('/api/admin/users', userData);
      console.log('✅ Usuario creado exitosamente:', response.data.data.rut_persona);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw this.handleError(error);
    }
  }

  // ✏️ Actualizar usuario
  async updateUser(rut, userData) {
    try {
      console.log(`✏️ Actualizando usuario RUT: ${rut}`);
      const response = await apiClient.put(`/api/admin/users/${rut}`, userData);
      console.log('✅ Usuario actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      throw this.handleError(error);
    }
  }

  // 🔐 Establecer contraseña
  async setUserPassword(rut, password, requireChange = true) {
    try {
      console.log(`🔐 Estableciendo contraseña para usuario RUT: ${rut}`);
      const response = await apiClient.put(`/api/admin/users/${rut}/password`, {
        password,
        requireChange
      });
      console.log('✅ Contraseña establecida exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error estableciendo contraseña:', error);
      throw this.handleError(error);
    }
  }

  // 🎲 Generar contraseña temporal
  async generateTemporaryPassword(rut) {
    try {
      console.log(`🎲 Generando contraseña temporal para usuario RUT: ${rut}`);
      const response = await apiClient.post(`/api/admin/users/${rut}/generate-password`);
      console.log('✅ Contraseña temporal generada');
      return response.data;
    } catch (error) {
      console.error('❌ Error generando contraseña temporal:', error);
      throw this.handleError(error);
    }
  }

  // 🗑️ Desactivar usuario
  async deactivateUser(rut) {
    try {
      console.log(`🗑️ Desactivando usuario RUT: ${rut}`);
      const response = await apiClient.put(`/api/admin/users/${rut}/deactivate`);
      console.log('✅ Usuario desactivado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error desactivando usuario:', error);
      throw this.handleError(error);
    }
  }

  // ✅ Activar usuario
  async activateUser(rut) {
    try {
      console.log(`✅ Activando usuario RUT: ${rut}`);
      const response = await apiClient.put(`/api/admin/users/${rut}/activate`);
      console.log('✅ Usuario activado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error activando usuario:', error);
      throw this.handleError(error);
    }
  }

  // 📝 Obtener perfiles disponibles
  async getProfiles() {
    try {
      console.log('📝 Obteniendo perfiles de usuario...');
      const response = await apiClient.get('/api/admin/profiles');
      console.log('✅ Perfiles obtenidos:', response.data.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo perfiles:', error);
      throw this.handleError(error);
    }
  }

  // 🔄 Alternar estado de usuario (activar/desactivar)
  async toggleUserStatus(rut, currentStatus) {
    try {
      if (currentStatus) {
        return await this.deactivateUser(rut);
      } else {
        return await this.activateUser(rut);
      }
    } catch (error) {
      console.error('❌ Error alternando estado del usuario:', error);
      throw this.handleError(error);
    }
  }

  // 🛠️ Métodos auxiliares

  // Formatear RUT para mostrar
  formatRut(rut, dv) {
    if (!rut || !dv) return '';
    const rutString = rut.toString();
    return `${rutString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
  }

  // Generar username automático
  generateUsername(nombre, apellido) {
    if (!nombre || !apellido) return '';
    const nombreClean = nombre.toLowerCase().trim().replace(/\s+/g, '');
    const apellidoClean = apellido.toLowerCase().trim().replace(/\s+/g, '');
    return `${nombreClean}.${apellidoClean}`;
  }

  // Validar RUT chileno
  validateRut(rut, dv) {
    if (!rut || !dv) return false;
    
    const rutClean = rut.toString().replace(/[^0-9]/g, '');
    const dvClean = dv.toString().toUpperCase();
    
    if (rutClean.length < 7 || rutClean.length > 8) return false;
    
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = rutClean.length - 1; i >= 0; i--) {
      suma += parseInt(rutClean[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();
    
    return dvCalculado === dvClean;
  }

  // Validar email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Manejar errores de la API
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message || 'Error del servidor';
      
      switch (status) {
        case 400:
          return new Error(`Datos inválidos: ${message}`);
        case 401:
          return new Error('No autorizado: Token inválido o expirado');
        case 403:
          return new Error('Acceso denegado: Permisos insuficientes');
        case 404:
          return new Error('No encontrado: ' + message);
        case 409:
          return new Error('Conflicto: ' + message);
        case 500:
          return new Error('Error interno del servidor');
        default:
          return new Error(`Error ${status}: ${message}`);
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión: No se pudo conectar con el servidor');
    } else {
      // Error de configuración
      return new Error('Error de configuración: ' + error.message);
    }
  }

  // Obtener color según el perfil
  getProfileColor(perfil) {
    switch (perfil) {
      case 'ADMINISTRADOR':
        return 'bg-red-100 text-red-800';
      case 'SUPERVISOR':
        return 'bg-blue-100 text-blue-800';
      case 'TECNICO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Obtener ícono según el perfil
  getProfileIcon(perfil) {
    switch (perfil) {
      case 'ADMINISTRADOR':
        return '👑';
      case 'SUPERVISOR':
        return '👨‍💼';
      case 'TECNICO':
        return '🔧';
      default:
        return '👤';
    }
  }
}

// Exportar instancia única del servicio
export default new AdminService();