<template>
  <p>Sidebar content</p>
</template>

<!-- <template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h2 class="logo">Scholarly</h2>
      <p class="user-info">{{ currentUser?.name }}</p>
      <span class="user-type">{{ userTypeLabel }}</span>
    </div>
    
    <ul class="nav-menu">
      <li v-for="item in navigationItems" :key="item.path" 
          :class="['nav-item', { active: isActiveRoute(item.path) }]">
        <router-link :to="item.path" class="nav-link">
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </li>
    </ul>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="logout-btn">
        <span class="nav-icon">🚪</span>
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentUser = inject('currentUser')
const userType = inject('userType')
const logout = inject('logout')

const props = defineProps({
  navigationItems: {
    type: Array,
    required: true
  }
})

const userTypeLabel = computed(() => {
  const labels = {
    student: 'Student',
    lecturer: 'Lecturer',
    advisor: 'Academic Advisor'
  }
  return labels[userType.value] || 'User'
})

const isActiveRoute = (path) => {
  return route.path === path || route.path.startsWith(path)
}

const handleLogout = () => {
  logout()
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #E5E7EB;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 0 24px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.logo {
  color: var(--royal-blue);
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.user-info {
  font-weight: 600;
  margin-bottom: 4px;
}

.user-type {
  color: var(--warm-gray);
  font-size: 14px;
}

.nav-menu {
  list-style: none;
  padding: 24px 0 0;
  flex: 1;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: var(--dark-charcoal);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item.active .nav-link {
  background: #EBF4FF;
  color: var(--royal-blue);
  border-right: 3px solid var(--royal-blue);
}

.nav-link:hover {
  background: #F9FAFB;
}

.nav-icon {
  font-size: 20px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid #E5E7EB;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  color: var(--dark-charcoal);
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #FEE2E2;
  border-color: var(--crimson-red);
  color: var(--crimson-red);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style> -->