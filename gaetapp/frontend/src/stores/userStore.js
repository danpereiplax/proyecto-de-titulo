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
    userRole: (state) => state.user?.perfil || state.user?.descripcion_perfil_usuario,
    userName: (state) => state.user ? `${state.user.nombre || state.user.nombre_persona} ${state.user.apellido || state.user.apellido_paterno_persona}` : '',
    isAdmin: (state) => (state.user?.perfil || state.user?.descripcion_perfil_usuario) === 'ADMINISTRADOR',
    isSupervisor: (state) => (state.user?.perfil || state.user?.descripcion_perfil_usuario) === 'SUPERVISOR',
    isTechnician: (state) => (state.user?.perfil || state.user?.descripcion_perfil_usuario) === 'TECNICO'
  },

  actions: {
    // Función de autenticación
    async checkAuth() {
      try {
        const token = localStorage.getItem('gaet_token')
        const userData = localStorage.getItem('gaet_user')
        
        if (token && userData) {
          this.token = token
          this.user = JSON.parse(userData)
          this.isAuthenticated = true
          
          // Configurar token en apiClient
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Verificar si el token sigue siendo válido
          await this.verifyToken()
          
          return true
        }
        
        return false
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        this.clearAuth()
        return false
      }
    },

    // Verificar token con el backend
    async verifyToken() {
      try {
        const response = await apiClient.get('/api/auth/verify')
        if (response.data.valid) {
          return true
        } else {
          this.clearAuth()
          return false
        }
      } catch (error) {
        console.error('Token inválido:', error)
        this.clearAuth()
        return false
      }
    },

    // Login con username y contraseña
    async login(credentials) {
      this.loading = true
      try {
        console.log('🔄 Iniciando login...', { username: credentials.username })
        
        const response = await apiClient.post('/api/auth/login', {
          username: credentials.username,
          password: credentials.password
        })

        console.log('✅ Login exitoso:', response.data)

        const { token, user, permissions } = response.data

        // Guardar en el store
        this.token = token
        this.user = user
        this.isAuthenticated = true
        this.permissions = permissions || []

        // Guardar en localStorage
        localStorage.setItem('gaet_token', token)
        localStorage.setItem('gaet_user', JSON.stringify(user))

        // Configurar token en apiClient para futuras peticiones
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

        console.log('👤 Usuario logueado:', {
          role: user.descripcion_perfil_usuario,
          name: `${user.nombre_persona} ${user.apellido_paterno_persona}`
        })

        return { success: true, user }
      } catch (error) {
        console.error('❌ Error en login:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Error de conexión'
        
        throw new Error(errorMessage)
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout() {
      try {
        // Intentar notificar al backend
        if (this.token) {
          await apiClient.post('/api/auth/logout')
        }
      } catch (error) {
        console.error('Error al cerrar sesión en el backend:', error)
      } finally {
        this.clearAuth()
      }
    },

    // Limpiar autenticación
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.permissions = []
      
      // Limpiar localStorage
      localStorage.removeItem('gaet_token')
      localStorage.removeItem('gaet_user')
      
      // Remover token del apiClient
      delete apiClient.defaults.headers.common['Authorization']
      
      console.log('🔄 Sesión cerrada')
    },

    // Actualizar perfil de usuario
    async updateProfile(profileData) {
      try {
        const response = await apiClient.put('/api/auth/profile', profileData)
        this.user = { ...this.user, ...response.data.user }
        localStorage.setItem('gaet_user', JSON.stringify(this.user))
        return response.data
      } catch (error) {
        console.error('Error actualizando perfil:', error)
        throw error
      }
    },

    // Cambiar contraseña
    async changePassword(passwordData) {
      try {
        const response = await apiClient.post('/api/auth/change-password', passwordData)
        return response.data
      } catch (error) {
        console.error('Error cambiando contraseña:', error)
        throw error
      }
    }
  }
})