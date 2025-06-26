import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { getPerfil } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
  },
  {
    path: '/tecnico',
    name: 'tecnico',
    component: () => import('../views/TecnicoView.vue'),
  },
  {
    path: '/supervisor',
    name: 'supervisor',
    component: () => import('../views/SupervisorView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Protege rutas según perfil
router.beforeEach((to, from, next) => {
  const perfil = getPerfil();

  if (to.path === '/admin' && perfil !== 'admin') return next('/');
  if (to.path === '/tecnico' && perfil !== 'tecnico') return next('/');
  if (to.path === '/supervisor' && perfil !== 'supervisor') return next('/');

  next();
});

export default router;
