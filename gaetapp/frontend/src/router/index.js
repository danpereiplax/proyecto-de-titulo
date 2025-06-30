// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Importar vistas
import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import SupervisorView from '@/views/SupervisorView.vue'
import TechnicianView from '@/views/TechnicianView.vue'
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
    meta: { 
      requiresAuth: false,
      redirectIfAuthenticated: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
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
      roles: ['ADMINISTRADOR', 'SUPERVISOR']
    }
  },
  {
    path: '/technician',
    name: 'Technician',
    component: TechnicianView,
    meta: { 
      requiresAuth: true,
      roles: ['ADMINISTRADOR', 'SUPERVISOR', 'TECNICO']
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

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // Verificar autenticación al cargar la app
  if (!userStore.isAuthenticated) {
    await userStore.checkAuth()
  }

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next('/login')
  }

  // Redirigir usuarios autenticados lejos del login
  if (to.meta.redirectIfAuthenticated && userStore.isAuthenticated) {
    const role = userStore.userProfile
    
    switch (role) {
      case 'ADMINISTRADOR':
        return next('/admin')
      case 'SUPERVISOR':
        return next('/supervisor')
      case 'TECNICO':
        return next('/technician')
      default:
        return next('/login')
    }
  }

  // Verificar permisos de rol
  if (to.meta.roles && userStore.isAuthenticated) {
    const userRole = userStore.userProfile
    
    if (!to.meta.roles.includes(userRole)) {
      // Redirigir a la vista apropiada para su rol
      switch (userRole) {
        case 'ADMINISTRADOR':
          return next('/admin')
        case 'SUPERVISOR':
          return next('/supervisor')
        case 'TECNICO':
          return next('/technician')
        default:
          return next('/login')
      }
    }
  }

  next()
})

export default router