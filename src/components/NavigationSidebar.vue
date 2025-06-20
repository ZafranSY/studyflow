<template>
  <div class="h-full flex flex-col bg-gray-900">
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 bg-gray-800">
      <div class="flex items-center">
        <div class="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <span class="ml-2 text-white font-semibold text-lg">StudyFlow</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-2 py-4 space-y-1">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.to"
        class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
        :class="isActive(item.to) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
      >
        <component :is="item.icon" class="mr-3 h-5 w-5" />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- User Info -->
    <div class="p-4 bg-gray-800">
      <div class="flex items-center">
        <div class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">
            {{ user?.name?.charAt(0) || 'U' }}
          </span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-white">{{ user?.name || 'User' }}</p>
          <p class="text-xs text-gray-400 capitalize">{{ userRole || 'Role' }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="mt-2 w-full text-left text-sm text-gray-400 hover:text-white transition-colors duration-200"
      >
        Sign out
      </button>
    </div>
  </div>
</template>

<script>
// Icons as inline components
const DashboardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
    </svg>
  `
}

const MarksIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
  `
}

const FeedbackIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
    </svg>
  `
}

const SimulationIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
  `
}

const CourseIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
    </svg>
  `
}

export default {
  name: 'NavigationSidebar',
  components: {
    DashboardIcon,
    MarksIcon,
    FeedbackIcon,
    SimulationIcon,
    CourseIcon
  },
  computed: {
    user() {
      return this.$store.getters.getCurrentUser
    },
    userRole() {
      return this.$store.getters.getUserRole
    },
    navigationItems() {
      if (this.userRole === 'student') {
        return [
          { name: 'Dashboard', to: '/student', icon: 'DashboardIcon' },
          { name: 'Marks', to: '/student/marks', icon: 'MarksIcon' },
          { name: 'Feedback', to: '/student/feedback', icon: 'FeedbackIcon' },
          { name: 'Simulation', to: '/student/simulation', icon: 'SimulationIcon' }
        ]
      } else if (this.userRole === 'lecturer') {
        return [
          { name: 'Courses', to: '/lecturer', icon: 'CourseIcon' }
        ]
      }
      return []
    }
  },
  methods: {
    isActive(route) {
      return this.$route.path === route
    },
    handleLogout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>