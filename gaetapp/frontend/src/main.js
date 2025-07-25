// frontend/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/userStore'
import './style.css'

async function initializeApp() {
  console.log('🚀 Inicializando aplicación GAET...');

  // Crear la aplicación Vue
  const app = createApp(App);

  // Configurar Pinia
  const pinia = createPinia();
  app.use(pinia);

  // Configurar router
  app.use(router);

  // Inicializar autenticación antes de montar la app
  console.log('🔐 Verificando autenticación persistente...');
  const userStore = useUserStore();
  
  try {
    await userStore.checkAuth();
    console.log('✅ Verificación de autenticación completada');
  } catch (error) {
    console.warn('⚠️ Error durante verificación de autenticación:', error);
    // No bloquear la aplicación, continuar con el montaje
  }

  // Montar la aplicación
  app.mount('#app');
  console.log('✅ Aplicación GAET montada exitosamente');
}

// Inicializar la aplicación
initializeApp().catch(error => {
  console.error('❌ Error crítico inicializando la aplicación:', error);
});