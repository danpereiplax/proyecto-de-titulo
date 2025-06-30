// frontend/src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/utils/apiClient'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('gaet_token'))
  const isAuthenticated = ref(false)
  const permissions = ref([])
  const loading = ref(false)

  // Getters
  const userProfile = computed(() => user.value?.descripcion_perfil_usuario || '')
  const userName = computed(() => {
    if (!user.value) return ''
    return `${user.value.nombre_persona} ${user.value.apellido_paterno_persona}`
  })
  const userEmail = computed(() => user.value?.email_corporativo || user.value?.email_pesonal || '')
  const isAdmin = computed(() => userProfile.value === 'Administrador')
  const isSupervisor = computed(() => userProfile.value === 'Supervisor')
  const isTechnician = computed(() => userProfile.value === 'Técnico')

  // Actions
  const login = async (credentials) => {
    try {
      loading.value = true
      
      const response = await apiClient.post('/auth/login', credentials)
      const { token: authToken, user: userData } = response.data
      
      // Guardar token y datos de usuario
      token.value = authToken
      user.value = userData
      isAuthenticated.value = true
      
      // Guardar en localStorage
      localStorage.setItem('gaet_token', authToken)
      localStorage.setItem('gaet_user', JSON.stringify(userData))
      
      // Cargar permisos del usuario
      await loadUserPermissions()
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Error durante el login:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.userMessage || 
                          'Error al iniciar sesión'
      
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    // Limpiar estado
    user.value = null
    token.value = null
    isAuthenticated.value = false
    permissions.value = []
    
    // Limpiar localStorage
    localStorage.removeItem('gaet_token')
    localStorage.removeItem('gaet_user')
    
    console.log('✅ Usuario desconectado correctamente')
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('gaet_token')
    const storedUser = localStorage.getItem('gaet_user')
    
    if (!storedToken || !storedUser) {
      logout()
      return false
    }
    
    try {
      // Verificar si el token sigue siendo válido
      const response = await apiClient.get('/auth/verify')
      
      // Restaurar estado desde localStorage
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      
      // Actualizar datos del usuario si es necesario
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('gaet_user', JSON.stringify(response.data.user))
      }
      
      await loadUserPermissions()
      
      return true
    } catch (error) {
      console.error('Token inválido o expirado:', error)
      logout()
      return false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      
      const response = await apiClient.put('/auth/profile', profileData)
      const updatedUser = response.data.user
      
      // Actualizar datos del usuario
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('gaet_user', JSON.stringify(user.value))
      
      return { success: true, user: user.value }
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.userMessage || 
                          'Error al actualizar perfil'
      
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      loading.value = true
      
      await apiClient.put('/auth/change-password', passwordData)
      
      return { success: true, message: 'Contraseña actualizada correctamente' }
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.userMessage || 
                          'Error al cambiar contraseña'
      
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const loadUserPermissions = async () => {
    try {
      const response = await apiClient.get('/auth/permissions')
      permissions.value = response.data.permissions || []
    } catch (error) {
      console.error('Error cargando permisos:', error)
      permissions.value = []
    }
  }

  const hasPermission = (permission) => {
    return permissions.value.includes(permission) || isAdmin.value
  }

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => hasPermission(permission))
  }

  const refreshToken = async () => {
    try {
      const response = await apiClient.post('/auth/refresh')
      const newToken = response.data.token
      
      token.value = newToken
      localStorage.setItem('gaet_token', newToken)
      
      return newToken
    } catch (error) {
      console.error('Error renovando token:', error)
      logout()
      throw error
    }
  }

  // Función para inicializar el store
  const initialize = async () => {
    return await checkAuth()
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    permissions,
    loading,
    
    // Getters
    userProfile,
    userName,
    userEmail,
    isAdmin,
    isSupervisor,
    isTechnician,
    
    // Actions
    login,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    loadUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshToken,
    initialize
  }
})