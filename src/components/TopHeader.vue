<template>
  <header class="top-header">
    <div class="header-left">
      <button class="mobile-menu-btn" @click="$emit('toggle-mobile-menu')">
        ☰
      </button>
      <h1 class="page-title">{{ title }}</h1>
    </div>
    
    <div class="header-actions">
      <div v-if="showSearch" class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search..." 
          class="search-input"
          @input="$emit('search', searchQuery)"
        />
        <button class="search-btn">🔍</button>
      </div>
      
      <slot name="actions"></slot>
      
      <button class="notification-btn" @click="$emit('notifications')">
        <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
        🔔
      </button>
      <button class="profile-btn" @click="$emit('profile')">
        {{ currentUser?.name?.charAt(0) }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Dummy Data
// const props = {
//   title: 'Dashboard',
//   showSearch: true,
//   notificationCount: 3
// }

const currentUser = {
  name: 'John Doe'
}

const searchQuery = ref('')
</script>

<style scoped>
.top-header {
  background: white;
  padding: 20px 32px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 280px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--dark-charcoal);
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 8px;
  padding: 8px 12px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  padding: 4px 8px;
  width: 200px;
}

.search-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
}

.notification-btn, .profile-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.notification-btn {
  background: #F3F4F6;
  font-size: 18px;
}

.profile-btn {
  background: var(--royal-blue);
  color: white;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--crimson-red);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .top-header {
    margin-left: 0;
    padding: 16px 20px;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .search-input {
    width: 150px;
  }
}
</style>