<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 flex items-center justify-center bg-blue-600 rounded-full">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome to StudyFlow
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
        
        <div class="space-y-4">
          <div>
            <label for="email" class="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="form-input"
              placeholder="Enter your email"
              v-model="loginForm.email"
            />
          </div>
          
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="form-input"
              placeholder="Enter your password"
              v-model="loginForm.password"
            />
          </div>
          
          <div>
            <label for="role" class="form-label">Role</label>
            <select
              id="role"
              name="role"
              required
              class="form-select"
              v-model="loginForm.role"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary btn-lg"
          >
            <span v-if="loading" class="spinner mr-2"></span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
        
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
          <div class="text-xs text-blue-700 space-y-1">
            <div><strong>Student:</strong> john@student.com | password</div>
            <div><strong>Lecturer:</strong> smith@lecturer.com | password</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        role: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null
      
      try {
        await this.$store.dispatch('login', this.loginForm)
        
        // Redirect based on role
        if (this.loginForm.role === 'student') {
          this.$router.push('/student')
        } else if (this.loginForm.role === 'lecturer') {
          this.$router.push('/lecturer')
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>