// frontend/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Importar estilos
import './style.css'

// Crear la aplicación
const app = createApp(App)

// Configurar Pinia (estado global)
const pinia = createPinia()
app.use(pinia)

// Configurar router
app.use(router)

// Configurar variables globales si es necesario
app.config.globalProperties.$apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Montar la aplicación
app.mount('#app')