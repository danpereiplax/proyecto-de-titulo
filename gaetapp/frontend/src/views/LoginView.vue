<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-16 w-16 flex items-center justify-center">
          <img class="h-12 w-auto" src="/logo-infomaxis.png" alt="Infomaxis" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema GAET
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Gestión de Actividades y Equipos Técnicos
        </p>
      </div>

      <!-- Formulario de Login -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Username -->
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              v-model="loginForm.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Usuario"
              :disabled="loading"
            >
          </div>
          
          <!-- Password -->
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="loginForm.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              :disabled="loading"
            >
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error de autenticación
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading || !loginForm.username || !loginForm.password"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!loading" class="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z"></path>
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <!-- Info adicional -->
        <div class="text-center">
          <p class="text-xs text-gray-500">
            Sistema desarrollado por Infomaxis
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    return { userStore, router }
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      errorMessage: ''
    }
  },
  async mounted() {
    console.log('🔍 LoginView montado, verificando autenticación existente...');
    
    // Si ya está autenticado, redirigir a la vista apropiada
    if (this.userStore.isAuthenticated) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      this.redirectToUserHome();
      return;
    }

    // Intentar restaurar sesión desde localStorage
    try {
      const authRestored = await this.userStore.checkAuth();
      if (authRestored) {
        console.log('✅ Sesión restaurada desde localStorage');
        this.redirectToUserHome();
        return;
      }
    } catch (error) {
      console.warn('⚠️ No se pudo restaurar la sesión:', error);
    }

    console.log('📝 Mostrando formulario de login');
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';

      console.log('🔄 Intentando login con:', this.loginForm.username);

      try {
        const result = await this.userStore.login({
          username: this.loginForm.username,
          password: this.loginForm.password
        });

        console.log('✅ Login exitoso!', result);

        // Redirigir según el rol del usuario
        this.redirectToUserHome();

      } catch (error) {
        console.error('❌ Error en login:', error);
        this.errorMessage = error.message || 'Error de conexión';
      } finally {
        this.loading = false;
      }
    },

    redirectToUserHome() {
      const role = this.userStore.userRole;
      console.log('🎯 Rol detectado:', role);

      let targetRoute = '/administrador'; // Default

      switch (role) {
        case 'ADMINISTRADOR':
          targetRoute = '/administrador';
          console.log('🔄 Redirigiendo a /administrador');
          break;
        case 'SUPERVISOR':
          targetRoute = '/supervisor';
          console.log('🔄 Redirigiendo a /supervisor');
          break;
        case 'TECNICO':
          targetRoute = '/tecnico';
          console.log('🔄 Redirigiendo a /tecnico');
          break;
        default:
          console.log('⚠️ Rol desconocido:', role, 'redirigiendo a /administrador');
          targetRoute = '/administrador';
      }

      // Usar replace para evitar que el usuario pueda volver al login con el botón atrás
      this.router.replace(targetRoute);
    }
  }
}
</script>