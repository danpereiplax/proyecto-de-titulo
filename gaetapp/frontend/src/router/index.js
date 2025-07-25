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
      roles: ['ADMINISTRADOR'],
      strictRole: true // Solo ADMINISTRADOR puede acceder
    }
  },
  {
    path: '/supervisor',
    name: 'Supervisor',
    component: SupervisorView,
    meta: { 
      requiresAuth: true, 
      roles: ['SUPERVISOR'],
      strictRole: true // Solo SUPERVISOR puede acceder
    }
  },
  {
    path: '/tecnico',
    name: 'Tecnico',
    component: TecnicoView,
    meta: { 
      requiresAuth: true, 
      roles: ['TECNICO'],
      strictRole: true // Solo TECNICO puede acceder
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

// Guards de navegación con seguridad estricta
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  console.log('🧭 Router Guard:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest,
    currentlyAuthenticated: userStore.isAuthenticated
  });

  // Si no está autenticado, intentar restaurar sesión desde localStorage
  if (!userStore.isAuthenticated) {
    console.log('🔄 Usuario no autenticado, verificando localStorage...');
    const authRestored = await userStore.checkAuth();
    console.log('📋 Resultado de checkAuth:', authRestored);
  }

  // Log del estado actual del usuario
  console.log('👤 Estado del usuario:', {
    isAuthenticated: userStore.isAuthenticated,
    userRole: userStore.userRole,
    userName: userStore.userName,
    isAdmin: userStore.isAdmin,
    isSupervisor: userStore.isSupervisor,
    isTechnician: userStore.isTechnician
  });

  // Ruta requiere ser invitado (no autenticado) - ej: login
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    console.log('🔄 Usuario ya autenticado, redirigiendo desde login...');
    const role = userStore.userRole;
    
    switch (role) {
      case 'ADMINISTRADOR':
        console.log('🔄 Redirigiendo a /administrador');
        return next('/administrador');
      case 'SUPERVISOR':
        console.log('🔄 Redirigiendo a /supervisor');
        return next('/supervisor');
      case 'TECNICO':
        console.log('🔄 Redirigiendo a /tecnico');
        return next('/tecnico');
      default:
        console.log('⚠️ Rol desconocido, redirigiendo a /administrador');
        return next('/administrador');
    }
  }

  // Ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      console.log('❌ Acceso denegado: No autenticado, redirigiendo al login');
      return next('/login');
    }

    // Verificar roles con seguridad estricta
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRole = userStore.userRole;
      
      // Si es strictRole, solo el rol exacto puede acceder
      if (to.meta.strictRole) {
        const hasExactRole = to.meta.roles.includes(userRole);
        
        console.log('🔐 Verificando acceso ESTRICTO:', {
          userRole,
          requiredRoles: to.meta.roles,
          hasExactRole,
          targetRoute: to.path
        });

        if (!hasExactRole) {
          console.log('❌ Acceso denegado: Rol no autorizado para esta sección');
          
          // Redirigir a la vista apropiada según el rol del usuario
          let redirectRoute;
          switch (userRole) {
            case 'ADMINISTRADOR':
              redirectRoute = '/administrador';
              break;
            case 'SUPERVISOR':
              redirectRoute = '/supervisor';
              break;
            case 'TECNICO':
              redirectRoute = '/tecnico';
              break;
            default:
              redirectRoute = '/login';
          }
          
          console.log(`🔄 Redirigiendo ${userRole} a ${redirectRoute}`);
          return next(redirectRoute);
        }
      } else {
        // Verificación jerárquica (ADMIN puede acceder a todo, SUPERVISOR a TECNICO, etc.)
        const hasPermission = to.meta.roles.includes(userRole);
        
        console.log('🔐 Verificando acceso JERÁRQUICO:', {
          userRole,
          requiredRoles: to.meta.roles,
          hasPermission
        });

        if (!hasPermission) {
          console.log('❌ Acceso denegado: Rol insuficiente');
          
          // Redirigir a la vista apropiada según el rol del usuario
          switch (userRole) {
            case 'ADMINISTRADOR':
              return next('/administrador');
            case 'SUPERVISOR':
              return next('/supervisor');
            case 'TECNICO':
              return next('/tecnico');
            default:
              return next('/login');
          }
        }
      }
    }
  }

  console.log('✅ Acceso permitido a:', to.path);
  next();
});

// Guard después de cada navegación
router.afterEach((to, from) => {
  console.log('📍 Navegación completada:', {
    from: from.path,
    to: to.path
  });
});

export default router;