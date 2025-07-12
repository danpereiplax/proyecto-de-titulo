// frontend/src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/utils/apiClient'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('gaet_token'))
  const loading = ref(false)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const userProfile = computed(() => {
    return user.value?.perfil || null
  })

  const userName = computed(() => {
    if (!user.value) return null
    return `${user.value.nombre} ${user.value.apellido}`
  })

  const userUsername = computed(() => {
    return user.value?.username || null
  })

  // Actions
  const login = async (credentials) => {
    try {
      loading.value = true
      
      console.log('🔐 Enviando credenciales:', { username: credentials.username })
      
      const response = await apiClient.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      })
      
      const { token: authToken, user: userData } = response.data
      
      console.log('✅ Login response:', { 
        success: response.data.success, 
        user: userData?.username,
        perfil: userData?.perfil 
      })
      
      if (authToken && userData) {
        // Guardar token
        token.value = authToken
        localStorage.setItem('gaet_token', authToken)
        
        // Guardar datos del usuario
        user.value = userData
        localStorage.setItem('gaet_user', JSON.stringify(userData))
        
        console.log('💾 Datos guardados:', { 
          username: userData.username, 
          perfil: userData.perfil 
        })
        
        return { success: true, user: userData }
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      
      // Limpiar datos en caso de error
      token.value = null
      user.value = null
      localStorage.removeItem('gaet_token')
      localStorage.removeItem('gaet_user')
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error de conexión'
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // Intentar notificar al servidor del logout
      if (token.value) {
        await apiClient.post('/auth/logout')
      }
    } catch (error) {
      console.warn('⚠️ Error al notificar logout al servidor:', error)
    } finally {
      // Limpiar estado local siempre
      token.value = null
      user.value = null
      localStorage.removeItem('gaet_token')
      localStorage.removeItem('gaet_user')
      console.log('👋 Logout completado')
    }
  }

  const changePassword = async (passwords) => {
    try {
      loading.value = true
      
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      
      return { success: true, message: response.data.message }
      
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cambiar contraseña'
      }
    } finally {
      loading.value = false
    }
  }

  const loadUserFromStorage = () => {
    try {
      const storedToken = localStorage.getItem('gaet_token')
      const storedUser = localStorage.getItem('gaet_user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        
        console.log('📱 Usuario cargado desde storage:', { 
          username: user.value?.username,
          perfil: user.value?.perfil 
        })
        
        return true
      }
    } catch (error) {
      console.error('❌ Error cargando usuario desde storage:', error)
      // Limpiar storage corrupto
      localStorage.removeItem('gaet_token')
      localStorage.removeItem('gaet_user')
    }
    
    return false
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      
      const response = await apiClient.put('/auth/profile', profileData)
      
      if (response.data.success) {
        // Actualizar datos locales
        user.value = { ...user.value, ...response.data.user }
        localStorage.setItem('gaet_user', JSON.stringify(user.value))
        
        return { success: true, message: 'Perfil actualizado exitosamente' }
      }
      
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil'
      }
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async () => {
    try {
      const response = await apiClient.post('/auth/refresh')
      
      if (response.data.token) {
        token.value = response.data.token
        localStorage.setItem('gaet_token', response.data.token)
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Error renovando token:', error)
      await logout()
      return false
    }
  }

  // Verificar permisos
  const hasPermission = (permission) => {
    if (!user.value) return false
    
    const permissions = {
      manageUsers: ['ADMINISTRADOR', 'RRHH'].includes(user.value.perfil),
      manageTasks: ['SUPERVISOR'].includes(user.value.perfil),
      executeTasks: ['TECNICO'].includes(user.value.perfil),
      viewReports: ['ADMINISTRADOR', 'SUPERVISOR', 'RRHH'].includes(user.value.perfil),
      viewAllData: ['ADMINISTRADOR'].includes(user.value.perfil)
    }
    
    return permissions[permission] || false
  }

  // Inicializar store
  const initialize = () => {
    return loadUserFromStorage()
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Computed
    isAuthenticated,
    userProfile,
    userName,
    userUsername,
    
    // Actions
    login,
    logout,
    changePassword,
    updateProfile,
    refreshToken,
    hasPermission,
    initialize
  }
})