// frontend/src/utils/apiClient.js
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

// Configuración base del cliente API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para requests - agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token || localStorage.getItem('gaet_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses - manejo de errores globales
apiClient.interceptors.response.use(
  (response) => {
    // Log de responses en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    
    return response
  },
  (error) => {
    const userStore = useUserStore()
    
    // Log de errores
    console.error('❌ API Error:', error.response?.data || error.message)
    
    // Manejo de errores específicos
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Token expirado o no válido
          console.warn('🔒 Token expirado o no válido, redirigiendo al login')
          userStore.logout()
          window.location.href = '/login'
          break
          
        case 403:
          console.warn('🚫 Acceso denegado')
          // Mostrar mensaje de acceso denegado
          break
          
        case 404:
          console.warn('🔍 Recurso no encontrado')
          break
          
        case 422:
          console.warn('📝 Error de validación:', data.errors)
          break
          
        case 500:
          console.error('💥 Error interno del servidor')
          break
          
        default:
          console.error(`❓ Error ${status}:`, data.message || 'Error desconocido')
      }
      
      // Personalizar el mensaje de error para el usuario
      const userMessage = getUserFriendlyMessage(status, data)
      error.userMessage = userMessage
    } else if (error.request) {
      // Error de conexión
      console.error('🔌 Error de conexión con el servidor')
      error.userMessage = 'Error de conexión. Verifica tu conexión a internet.'
    } else {
      // Error de configuración
      console.error('⚙️ Error de configuración:', error.message)
      error.userMessage = 'Error interno. Intenta nuevamente.'
    }
    
    return Promise.reject(error)
  }
)

// Función para obtener mensajes amigables para el usuario
function getUserFriendlyMessage(status, data) {
  const messages = {
    400: 'Datos inválidos. Verifica la información ingresada.',
    401: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'El recurso solicitado no fue encontrado.',
    409: 'Ya existe un registro con estos datos.',
    422: 'Error en los datos enviados. Revisa los campos marcados.',
    429: 'Demasiadas solicitudes. Intenta nuevamente en unos momentos.',
    500: 'Error interno del servidor. Intenta nuevamente más tarde.',
    502: 'Servicio temporalmente no disponible.',
    503: 'Servicio en mantenimiento. Intenta más tarde.',
  }
  
  return data?.message || messages[status] || 'Ha ocurrido un error inesperado.'
}

// Helpers para operaciones comunes
export const apiHelpers = {
  // Construir URL con parámetros de consulta
  buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint, apiClient.defaults.baseURL)
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        url.searchParams.append(key, params[key])
      }
    })
    return url.pathname + url.search
  },

  // Descargar archivo desde el servidor
  async downloadFile(url, filename) {
    try {
      const response = await apiClient.get(url, { responseType: 'blob' })
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
      throw error
    }
  },

  // Subir archivo al servidor
  async uploadFile(url, file, onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(percentCompleted)
          }
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  // Formatear datos para envío
  formatDataForSend(data) {
    const formatted = { ...data }
    
    // Convertir strings vacíos a null
    Object.keys(formatted).forEach(key => {
      if (formatted[key] === '') {
        formatted[key] = null
      }
    })
    
    return formatted
  },

  // Parsear respuesta paginada
  parsePaginatedResponse(response) {
    return {
      data: response.data.data || response.data,
      pagination: {
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || 0,
        itemsPerPage: response.data.itemsPerPage || 10
      }
    }
  }
}

export default apiClient