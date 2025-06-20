<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
    <h1 class="text-6xl font-bold text-blue-600">404</h1>
    <h2 class="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
    <p class="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition">
      Go to Homepage
    </router-link>
  </div>
</template>

<script setup>
// A simple 404 page.
</script>
