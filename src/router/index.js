import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import StudentDashboard from '../views/student/StudentDashboard.vue'
import StudentMarks from '../views/student/StudentMarks.vue'
import StudentFeedback from '../views/student/StudentFeedback.vue'
import StudentSimulation from '../views/student/StudentSimulation.vue'
import LecturerCourse from '../views/lecturer/LecturerCourse.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/marks',
    name: 'StudentMarks',
    component: StudentMarks,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/feedback',
    name: 'StudentFeedback',
    component: StudentFeedback,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/simulation',
    name: 'StudentSimulation',
    component: StudentSimulation,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/lecturer',
    name: 'LecturerCourse',
    component: LecturerCourse,
    meta: { requiresAuth: true, role: 'lecturer' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.meta.role && userRole !== to.meta.role) {
    next('/')
  } else {
    next()
  }
})

export default router