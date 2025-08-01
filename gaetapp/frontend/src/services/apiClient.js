// frontend/src/services/apiClient.js

import axios from 'axios'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: '/api', // Usa rutas relativas para producción
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para agregar token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    
    // Manejo de errores comunes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o no válido
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('Acceso denegado')
          break
        case 404:
          console.error('Recurso no encontrado')
          break
        case 500:
          console.error('Error interno del servidor')
          break
        default:
          console.error('Error de API:', error.response.data)
      }
    } else if (error.request) {
      console.error('Error de red - No se pudo conectar al servidor')
    } else {
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient