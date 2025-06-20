<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <h1 class="app-title">Scholarly</h1>
        <p class="app-subtitle">Academic Management System</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="user-type-selector">
          <button 
            type="button"
            v-for="type in userTypes" 
            :key="type.value"
            @click="selectedUserType = type.value"
            :class="['user-type-btn', { active: selectedUserType === type.value }]"
          >
            <span class="icon">{{ type.icon }}</span>
            {{ type.label }}
          </button>
        </div>

        <div class="form-group">
          <label :for="usernameField">{{ usernameLabel }}</label>
          <input 
            :id="usernameField"
            v-model="credentials.username"
            type="text" 
            class="input-field"
            :placeholder="usernamePlaceholder"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">{{ passwordLabel }}</label>
          <input 
            id="password"
            v-model="credentials.password"
            type="password" 
            class="input-field"
            :placeholder="passwordPlaceholder"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <a href="#" class="forgot-link">{{ forgotText }}</a>
        </div>

        <button type="submit" class="btn-primary login-btn" :disabled="isLoading">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>

        <div v-if="selectedUserType === 'lecturer'" class="two-factor-option">
          <label class="checkbox-label">
            <input type="checkbox" v-model="enableTwoFactor" />
            <span class="checkmark"></span>
            Enable Two-Factor Authentication
          </label>
        </div>
      </form>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const login = inject('login')

const selectedUserType = ref('student')
const credentials = ref({ username: '', password: '' })
const rememberMe = ref(false)
const enableTwoFactor = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const userTypes = [
  { value: 'student', label: 'Student', icon: '👤' },
  { value: 'lecturer', label: 'Lecturer', icon: '👨‍🏫' },
  { value: 'advisor', label: 'Academic Advisor', icon: '👥' }
]

const usernameField = computed(() => `${selectedUserType.value}-username`)
const usernameLabel = computed(() => {
  switch (selectedUserType.value) {
    case 'student': return 'Matric Number'
    case 'lecturer': return 'Email / Staff ID'
    case 'advisor': return 'Advisor ID'
    default: return 'Username'
  }
})

const usernamePlaceholder = computed(() => {
  switch (selectedUserType.value) {
    case 'student': return 'Enter your matric number'
    case 'lecturer': return 'Enter your email or staff ID'
    case 'advisor': return 'Enter your advisor ID'
    default: return 'Username'
  }
})

const passwordLabel = computed(() => {
  return selectedUserType.value === 'student' ? 'Secure PIN' : 'Password'
})

const passwordPlaceholder = computed(() => {
  return selectedUserType.value === 'student' ? 'Enter your secure PIN' : 'Enter your password'
})

const forgotText = computed(() => {
  return selectedUserType.value === 'student' ? 'Forgot PIN?' : 'Forgot Password?'
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock successful login
    const user = {
      id: '12345',
      name: selectedUserType.value === 'student' ? 'John Doe' : 'Dr. Jane Smith',
      type: selectedUserType.value,
      email: credentials.value.username
    }
    
    login(user, selectedUserType.value)

    // Redirect based on user type
    const dashboardRoutes = {
      student: '/student/dashboard',
      lecturer: '/lecturer/dashboard',
      advisor: '/advisor/dashboard'
    }
    
    router.push(dashboardRoutes[selectedUserType.value])
  } catch (error) {
    errorMessage.value = 'Invalid credentials. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--royal-blue) 0%, var(--emerald-green) 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.app-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--royal-blue);
  margin-bottom: 8px;
}

.app-subtitle {
  color: var(--warm-gray);
  font-size: 16px;
}

.user-type-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: #F3F4F6;
  padding: 4px;
  border-radius: 12px;
}

.user-type-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--warm-gray);
}

.user-type-btn.active {
  background: white;
  color: var(--royal-blue);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark-charcoal);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.forgot-link {
  color: var(--royal-blue);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  font-size: 16px;
  margin-bottom: 16px;
}

.two-factor-option {
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.error-message {
  background: #FEE2E2;
  color: var(--crimson-red);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  display: inline-block;
}

input[type="checkbox"]:checked + .checkmark {
  background-color: var(--royal-blue);
  border-color: var(--royal-blue);
}
</style>