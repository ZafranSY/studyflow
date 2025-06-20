<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Top Navigation Bar -->
    <TopHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex flex-grow pt-16"> <!-- pt-16 to account for fixed navbar height -->
      <!-- Sidebar -->
      <NavigationSidebar :is-open="isSidebarOpen" />

      <!-- Main Content Panel -->
      <main :class="['flex-grow p-6 transition-all duration-300 ease-in-out', { 'ml-0 md:ml-64': isSidebarOpen, 'ml-0': !isSidebarOpen }]">
          <!-- The router will render the specific page component here -->
          <router-view />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 text-center text-sm mt-auto">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2025 StudyFlow. All rights reserved.</p>
        <nav class="space-x-4 mt-2 md:mt-0">
          <a href="#" class="hover:underline">Privacy Policy</a>
          <a href="#" class="hover:underline">Terms of Service</a>
          <a href="#" class="hover:underline">Contact Us</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopHeader from '@/components/TopHeader.vue';
import NavigationSidebar from '@/components/NavigationSidebar.vue';

const isSidebarOpen = ref(true); // Default to open on desktop

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>
/* Responsive main content margin */
@media (max-width: 767px) {
  main {
    margin-left: 0 !important;
  }
}
</style>
