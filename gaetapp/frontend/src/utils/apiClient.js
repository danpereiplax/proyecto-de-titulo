// frontend/src/utils/apiClient.js
import axios from 'axios'

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // SIN /api al final
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para peticiones - agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gaet_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log('🔄 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers
    })
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para respuestas - manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      fullError: error.response?.data
    })

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      console.log('🔐 Token expirado, redirigiendo al login')
      localStorage.removeItem('gaet_token')
      localStorage.removeItem('gaet_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient