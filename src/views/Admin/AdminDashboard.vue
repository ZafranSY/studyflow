<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold text-lg mb-2 text-gray-800">User Management</h3>
        <input type="text" v-model="userSearch" placeholder="Search users by name or role..." class="w-full px-3 py-2 border border-gray-300 rounded-md mb-3" />
        <ul class="space-y-2 text-sm text-gray-700">
          <li v-for="user in filteredUsers" :key="user.id" class="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
            <span>{{ user.name }} ({{ user.role }})</span>
            <div>
              <button @click="resetPassword(user.id)" class="text-blue-600 hover:underline text-xs mr-2">Reset Password</button>
              <button @click="toggleUserStatus(user.id)" :class="['text-xs', user.active ? 'text-red-600' : 'text-green-600', 'hover:underline']">
                {{ user.active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold text-lg mb-2 text-gray-800">System Logs (Placeholder)</h3>
        <div class="h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          [Detailed System Activity Logs]
        </div>
        <p class="text-sm text-gray-600 mt-2">Last updated: {{ new Date().toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const adminData = ref({
  users: [
    { id: 1, name: 'Alice Smith', role: 'student', active: true },
    { id: 2, name: 'Dr. John Doe', role: 'lecturer', active: true },
    { id: 3, name: 'Ms. Jane Roe', role: 'advisor', active: true },
    { id: 4, name: 'Admin User', role: 'admin', active: true },
    { id: 5, name: 'Inactive Student', role: 'student', active: false },
  ],
});

const userSearch = ref('');
const filteredUsers = computed(() => {
  if (!userSearch.value) {
    return adminData.value.users;
  }
  const searchTerm = userSearch.value.toLowerCase();
  return adminData.value.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm)
  );
});

const resetPassword = (userId) => {
  console.log(`Resetting password for user ID: ${userId}`);
  // In a real app, send reset request to backend
};

const toggleUserStatus = (userId) => {
  const user = adminData.value.users.find(u => u.id === userId);
  if (user) {
    user.active = !user.active;
    console.log(`User ${user.name} is now ${user.active ? 'activated' : 'deactivated'}.`);
    // In a real app, update user status in backend
  }
};
</script>
