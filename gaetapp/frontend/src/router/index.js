// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Importar vistas
import LoginView from '@/views/LoginView.vue'
import AdministradorView from '@/views/AdministradorView.vue'
import SupervisorView from '@/views/SupervisorView.vue'
import TecnicoView from '@/views/TecnicoView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/administrador',
    name: 'Administrador',
    component: AdministradorView,
    meta: { 
      requiresAuth: true, 
      roles: ['ADMINISTRADOR'] 
    }
  },
  {
    path: '/supervisor',
    name: 'Supervisor',
    component: SupervisorView,
    meta: { 
      requiresAuth: true, 
      roles: ['SUPERVISOR', 'ADMINISTRADOR'] 
    }
  },
  {
    path: '/tecnico',
    name: 'Tecnico',
    component: TecnicoView,
    meta: { 
      requiresAuth: true, 
      roles: ['TECNICO', 'SUPERVISOR', 'ADMINISTRADOR'] 
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards de navegación
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  console.log('🔍 Router Guard:', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest,
    isAuthenticated: userStore.isAuthenticated
  })

  // Verificar autenticación si no está logueado
  if (!userStore.isAuthenticated) {
    const isAuthValid = await userStore.checkAuth()
    console.log('🔐 Verificación de auth:', isAuthValid)
  }

  // Ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      console.log('❌ Acceso denegado: No autenticado')
      return next('/login')
    }

    // Verificar roles si están definidos
    if (to.meta.roles) {
      const userRole = userStore.userRole
      if (!to.meta.roles.includes(userRole)) {
        console.log('❌ Acceso denegado: Rol insuficiente', { userRole, requiredRoles: to.meta.roles })
        
        // Redirigir según el rol del usuario
        switch (userRole) {
          case 'ADMINISTRADOR':
            return next('/administrador')
          case 'SUPERVISOR':
            return next('/supervisor')
          case 'TECNICO':
            return next('/tecnico')
          default:
            return next('/login')
        }
      }
    }
  }

  // Ruta requiere ser invitado (no logueado)
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    const userRole = userStore.userRole
    console.log('🔄 Usuario ya logueado, redirigiendo según rol:', userRole)
    
    switch (userRole) {
      case 'ADMINISTRADOR':
        return next('/administrador')
      case 'SUPERVISOR':
        return next('/supervisor')
      case 'TECNICO':
        return next('/tecnico')
      default:
        return next('/administrador')
    }
  }

  next()
})

export default router