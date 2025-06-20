<template>
  <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
    <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">StudyFlow Login</h2>
    <form @submit.prevent="performLogin" class="space-y-5">
      <div>
        <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">
          {{ authStore.loginType(identifier) === 'student' ? 'Matric Number' : 'Email' }}
        </label>
        <input
          id="identifier"
          v-model="identifier"
          :type="authStore.loginType(identifier) === 'student' ? 'text' : 'email'"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          :placeholder="authStore.loginType(identifier) === 'student' ? 'e.g., student123' : 'e.g., lecturer@example.com'"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        />
      </div>
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center">
          <input type="checkbox" v-model="rememberMe" class="form-checkbox h-4 w-4 text-blue-600 rounded" />
          <span class="ml-2 text-gray-700">Remember me</span>
        </label>
        <a href="#" class="text-blue-600 hover:underline">Forgot Password?</a>
      </div>
      <div class="text-center text-gray-600 text-sm">
        <p>CAPTCHA Placeholder: Please verify you are not a robot.</p>
        <div class="h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mt-2">
          [CAPTCHA Widget Here]
        </div>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
      >
        Login
      </button>
      <p v-if="authStore.loginError" class="text-red-500 text-center text-sm mt-3">{{ authStore.loginError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const identifier = ref('');
const password = ref('');
const rememberMe = ref(false);

const performLogin = () => {
  authStore.handleLogin(identifier.value, password.value);
};
</script>
