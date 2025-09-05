import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AuthView from '../views/AuthView.vue';
import DashboardView from '../views/DashboardView.vue';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state if not already done
  if (!authStore.user && !authStore.token) {
    authStore.initializeAuth();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth but user is not authenticated
    next('/login');
  } else if (requiresAdmin && !isAdmin) {
    // Redirect to home page if route requires admin but user is not admin
    next('/');
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // Redirect based on user role
    if (isAdmin) {
      next('/dashboard');
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
