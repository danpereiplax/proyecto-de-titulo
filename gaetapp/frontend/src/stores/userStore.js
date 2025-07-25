// frontend/src/stores/userStore.js
import { defineStore } from 'pinia'
import apiClient from '@/utils/apiClient'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    permissions: []
  }),

  getters: {
    // Buscar el rol en ambos campos posibles
    userRole: (state) => state.user?.perfil || state.user?.descripcion_perfil_usuario,
    userName: (state) => {
      if (!state.user) return '';
      const nombre = state.user.nombre_persona || state.user.nombre;
      const apellido = state.user.apellido_paterno_persona || state.user.apellido;
      return `${nombre} ${apellido}`;
    },
    isAdmin: (state) => {
      const role = state.user?.perfil || state.user?.descripcion_perfil_usuario;
      return role === 'ADMINISTRADOR';
    },
    isSupervisor: (state) => {
      const role = state.user?.perfil || state.user?.descripcion_perfil_usuario;
      return role === 'SUPERVISOR';
    },
    isTechnician: (state) => {
      const role = state.user?.perfil || state.user?.descripcion_perfil_usuario;
      return role === 'TECNICO';
    }
  },

  actions: {
    // Función para verificar autenticación persistente
    async checkAuth() {
      try {
        console.log('🔍 Verificando autenticación persistente...');
        
        const token = localStorage.getItem('gaet_token');
        const userData = localStorage.getItem('gaet_user');
        
        if (token && userData) {
          console.log('📝 Token y datos de usuario encontrados en localStorage');
          
          this.token = token;
          this.user = JSON.parse(userData);
          this.isAuthenticated = true;
          
          // Configurar token en apiClient
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          console.log('✅ Autenticación restaurada:', {
            user: this.userName,
            role: this.userRole,
            isAuthenticated: this.isAuthenticated
          });
          
          // Opcional: Verificar si el token sigue siendo válido con el backend
          try {
            await this.verifyToken();
          } catch (error) {
            console.warn('⚠️ Token inválido, pero continuando con datos locales');
            // No lanzar error aquí, permitir continuar con datos locales
          }
          
          return true;
        }
        
        console.log('❌ No se encontraron credenciales en localStorage');
        return false;
      } catch (error) {
        console.error('❌ Error verificando autenticación:', error);
        this.clearAuth();
        return false;
      }
    },

    // Verificar token con el backend (opcional)
    async verifyToken() {
      try {
        const response = await apiClient.get('/api/auth/verify');
        if (response.data.valid) {
          console.log('✅ Token válido en el backend');
          return true;
        } else {
          console.log('❌ Token inválido en el backend');
          this.clearAuth();
          return false;
        }
      } catch (error) {
        console.error('❌ Error verificando token con backend:', error);
        // No limpiar auth aquí, el backend podría estar temporalmente no disponible
        throw error;
      }
    },

    // Login con username y contraseña
    async login(credentials) {
      this.loading = true;
      try {
        console.log('🔄 Iniciando login...', { username: credentials.username });
        
        const response = await apiClient.post('/api/auth/login', {
          username: credentials.username,
          password: credentials.password
        });

        console.log('✅ Login exitoso:', response.data);

        const { token, user, permissions } = response.data;

        // Guardar en el store
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        this.permissions = permissions || [];

        // Guardar en localStorage para persistencia
        localStorage.setItem('gaet_token', token);
        localStorage.setItem('gaet_user', JSON.stringify(user));

        // Configurar token en apiClient para futuras peticiones
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('👤 Usuario logueado:', {
          role: this.userRole,
          name: this.userName,
          isAdmin: this.isAdmin,
          isSupervisor: this.isSupervisor
        });

        return { success: true, user };
      } catch (error) {
        console.error('❌ Error en login:', error);
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Error de conexión';
        
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    // Logout
    async logout() {
      try {
        console.log('🔄 Cerrando sesión...');
        
        // Intentar notificar al backend
        if (this.token) {
          try {
            await apiClient.post('/api/auth/logout');
          } catch (error) {
            console.warn('⚠️ Error al notificar logout al backend:', error);
          }
        }
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
      } finally {
        this.clearAuth();
      }
    },

    // Limpiar autenticación
    clearAuth() {
      console.log('🧹 Limpiando autenticación...');
      
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.permissions = [];
      
      // Limpiar localStorage
      localStorage.removeItem('gaet_token');
      localStorage.removeItem('gaet_user');
      
      // Remover token del apiClient
      delete apiClient.defaults.headers.common['Authorization'];
      
      console.log('✅ Sesión cerrada completamente');
    },

    // Actualizar perfil de usuario
    async updateProfile(profileData) {
      try {
        const response = await apiClient.put('/api/auth/profile', profileData);
        this.user = { ...this.user, ...response.data.user };
        localStorage.setItem('gaet_user', JSON.stringify(this.user));
        return response.data;
      } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        throw error;
      }
    },

    // Cambiar contraseña
    async changePassword(passwordData) {
      try {
        const response = await apiClient.put('/api/password/change-password', passwordData);
        return response.data;
      } catch (error) {
        console.error('❌ Error cambiando contraseña:', error);
        throw error;
      }
    }
  }
});