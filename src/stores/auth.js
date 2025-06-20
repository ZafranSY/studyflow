import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router';

// Mock User Data (for login simulation)
const mockUsers = {
  'student123': { password: 'password', role: 'student', name: 'Alice Smith', matricNo: 'S1234567A', avatar: 'https://placehold.co/32x32/EBF4FF/76A9FA?text=A' },
  'lecturer@example.com': { password: 'password', role: 'lecturer', name: 'Dr. John Doe', avatar: 'https://placehold.co/32x32/FEF3C7/FBBF24?text=J' },
  'advisor@example.com': { password: 'password', role: 'advisor', name: 'Ms. Jane Roe', avatar: 'https://placehold.co/32x32/FEE2E2/F87171?text=J' },
  'admin@example.com': { password: 'password', role: 'admin', name: 'Admin User', avatar: 'https://placehold.co/32x32/E5E7EB/4B5563?text=A' },
};

export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref(false);
  const userRole = ref('guest'); // 'guest', 'student', 'lecturer', 'advisor', 'admin'
  const userProfile = ref(null);
  const loginError = ref('');

  // Getters
  const loginType = computed(() => (identifier) => {
    return identifier.includes('@') ? 'email' : 'student';
  });

  // Actions
  function handleLogin(identifier, password) {
    loginError.value = '';
    const user = mockUsers[identifier];

    if (user && user.password === password) {
      isAuthenticated.value = true;
      userRole.value = user.role;
      userProfile.value = {
        name: user.name,
        matricNo: user.matricNo || null,
        avatar: user.avatar,
      };
      
      // Navigate to the correct dashboard after successful login
      router.push({ name: 'Home' });

    } else {
      loginError.value = 'Invalid credentials. Please try again.';
      return false;
    }
    return true;
  }

  function handleLogout() {
    isAuthenticated.value = false;
    userRole.value = 'guest';
    userProfile.value = null;
    loginError.value = '';
    router.push({ name: 'Login' });
  }

  return {
    isAuthenticated,
    userRole,
    userProfile,
    loginError,
    loginType,
    handleLogin,
    handleLogout,
  }
})
