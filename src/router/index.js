import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import LoginLayout from '@/layouts/LoginLayout.vue'

// Pages
import LoginPage from '@/pages/LoginPage.vue'
import StudentDashboard from '@/pages/student/StudentDashboard.vue'
import LecturerDashboard from '@/pages/lecturer/LecturerDashboard.vue'
import AdvisorDashboard from '@/pages/advisor/AdvisorDashboard.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import NotFound from '@/pages/NotFound.vue'


const routes = [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      { path: '', name: 'Login', component: LoginPage }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      // Redirect root path based on user role
      {
        path: '',
        name: 'Home',
        redirect: () => {
          const auth = useAuthStore();
          switch (auth.userRole) {
            case 'student': return { name: 'StudentDashboard' };
            case 'lecturer': return { name: 'LecturerDashboard' };
            case 'advisor': return { name: 'AdvisorDashboard' };
            case 'admin': return { name: 'AdminDashboard' };
            default: return { name: 'Login' }; // Fallback
          }
        },
      },
      // Student Routes
      {
        path: 'student/dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { role: 'student' }
      },
      // Lecturer Routes
      {
        path: 'lecturer/dashboard',
        name: 'LecturerDashboard',
        component: LecturerDashboard,
        meta: { role: 'lecturer' }
      },
       // Advisor Routes
       {
        path: 'advisor/dashboard',
        name: 'AdvisorDashboard',
        component: AdvisorDashboard,
        meta: { role: 'advisor' }
      },
       // Admin Routes
       {
        path: 'admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { role: 'admin' }
      },
      // You can add other pages like settings, etc. here
    ]
  },
  // Catch-all 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.role;

  if (requiresAuth && !auth.isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login
    next({ name: 'Login' });
  } else if (auth.isAuthenticated && to.name === 'Login') {
    // If user is authenticated and tries to go to login page, redirect to home
    next({ name: 'Home' });
  } else if (requiresAuth && requiredRole && auth.userRole !== requiredRole) {
    // If route requires a specific role and user doesn't have it, redirect
    // You might want to show a "Not Authorized" page instead
    console.warn(`Access denied. Route requires role '${requiredRole}', but user has role '${auth.userRole}'.`);
    next({ name: 'Home' }); // Redirect to their default dashboard
  }
  else {
    // Otherwise, allow navigation
    next();
  }
});


export default router
