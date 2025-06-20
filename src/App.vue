<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center flex-grow p-4">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">StudyFlow Login</h2>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">
              {{ loginType === 'student' ? 'Matric Number' : 'Email' }}
            </label>
            <input
              id="identifier"
              v-model="identifier"
              :type="loginType === 'student' ? 'text' : 'email'"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              :placeholder="loginType === 'student' ? 'e.g., 12345678' : 'e.g., lecturer@example.com'"
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
          <p v-if="loginError" class="text-red-500 text-center text-sm mt-3">{{ loginError }}</p>
        </form>
      </div>
    </div>

    <!-- Main Application Layout -->
    <div v-else class="flex flex-col flex-grow">
      <!-- Navigation Bar -->
      <nav class="bg-white shadow-sm p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="md:hidden text-gray-600 hover:text-gray-900 mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-800">StudyFlow</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleNotifications" class="text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span v-if="notifications.length > 0" class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div v-if="showNotifications" class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20">
              <div v-if="notifications.length === 0" class="px-4 py-2 text-sm text-gray-500">No new notifications.</div>
              <a v-for="notif in notifications" :key="notif.id" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {{ notif.message }}
              </a>
            </div>
          </div>
          <div class="relative">
            <button @click="toggleProfileMenu" class="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <img :src="userProfile.avatar" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
              <span class="hidden md:block">{{ userProfile.name }}</span>
            </button>
            <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
              <hr class="my-1 border-gray-100" />
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex flex-grow pt-16"> <!-- pt-16 to account for fixed navbar height -->
        <!-- Sidebar -->
        <aside :class="['bg-gray-800 text-white w-64 p-4 flex-shrink-0 transition-transform duration-300 ease-in-out', { '-translate-x-full md:translate-x-0': !isSidebarOpen }]" class="fixed md:static inset-y-0 left-0 z-20">
          <h3 class="text-lg font-semibold mb-4">{{ userRole.charAt(0).toUpperCase() + userRole.slice(1) }} Dashboard</h3>
          <nav class="space-y-2">
            <a
              v-for="item in sidebarNav"
              :key="item.name"
              :href="item.link"
              @click.prevent="currentPage = item.page"
              :class="['flex items-center p-2 rounded-md hover:bg-gray-700', { 'bg-blue-600 hover:bg-blue-700': currentPage === item.page }]"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.name }}</span>
            </a>
          </nav>
        </aside>

        <!-- Main Content Panel -->
        <main :class="['flex-grow p-6 transition-all duration-300 ease-in-out', { 'ml-0 md:ml-64': isSidebarOpen }]">
          <div class="bg-white shadow-lg rounded-lg p-6">
            <!-- Student UI -->
            <div v-if="userRole === 'student'">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Student Dashboard</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-blue-800">Marks Overview</h3>
                  <table class="min-w-full text-sm text-left text-gray-600">
                    <thead>
                      <tr class="border-b">
                        <th class="py-2">Component</th>
                        <th class="py-2">Marks</th>
                        <th class="py-2">Weightage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="mark in studentData.marks" :key="mark.component" class="border-b last:border-b-0">
                        <td class="py-2">{{ mark.component }}</td>
                        <td class="py-2">{{ mark.score }} / {{ mark.total }}</td>
                        <td class="py-2">{{ mark.weightage }}%</td>
                      </tr>
                    </tbody>
                  </table>
                  <p class="mt-4 text-md font-medium text-gray-800">Total Grade: {{ studentData.totalGrade }}%</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-green-800">Progress Tracker</h3>
                  <div v-for="course in studentData.courses" :key="course.name" class="mb-3">
                    <p class="text-sm font-medium">{{ course.name }}</p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: course.progress + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ course.progress }}% Complete</span>
                  </div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-yellow-800">Class Rank & Percentile</h3>
                  <p class="text-xl font-bold text-gray-800">Rank: {{ studentData.rank }}</p>
                  <p class="text-xl font-bold text-gray-800">Percentile: {{ studentData.percentile }}%</p>
                  <p class="text-sm text-gray-600 mt-2">Compared to {{ studentData.totalPeers }} coursemates.</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg shadow-sm col-span-full">
                  <h3 class="font-semibold text-lg mb-2 text-purple-800">Remark Request</h3>
                  <form @submit.prevent="submitRemarkRequest" class="space-y-3">
                    <div>
                      <label for="assessment" class="block text-sm font-medium text-gray-700">Assessment Component</label>
                      <select id="assessment" v-model="remarkRequest.assessment" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select an assessment</option>
                        <option v-for="mark in studentData.marks" :key="mark.component" :value="mark.component">{{ mark.component }}</option>
                      </select>
                    </div>
                    <div>
                      <label for="reason" class="block text-sm font-medium text-gray-700">Reason for Request</label>
                      <textarea id="reason" v-model="remarkRequest.reason" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Provide a detailed reason..."></textarea>
                    </div>
                    <button type="submit" class="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">Submit Request</button>
                  </form>
                  <p v-if="remarkMessage" class="mt-3 text-sm text-purple-700">{{ remarkMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Lecturer UI -->
            <div v-else-if="userRole === 'lecturer'">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Lecturer Dashboard</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-red-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-red-800">Manage Student Records</h3>
                  <table class="min-w-full text-sm text-left text-gray-600">
                    <thead>
                      <tr class="border-b">
                        <th class="py-2">Student Name</th>
                        <th class="py-2">Matric No.</th>
                        <th class="py-2">Overall Grade</th>
                        <th class="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in lecturerData.students" :key="student.id" class="border-b last:border-b-0">
                        <td class="py-2">{{ student.name }}</td>
                        <td class="py-2">{{ student.matricNo }}</td>
                        <td class="py-2">{{ student.overallGrade }}%</td>
                        <td class="py-2">
                          <button @click="viewStudent(student.id)" class="text-blue-600 hover:underline text-xs">View/Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Bulk Upload CSV</button>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-orange-800">Create/Edit Assessment</h3>
                  <form @submit.prevent="saveAssessment" class="space-y-3">
                    <div>
                      <label for="assessmentTitle" class="block text-sm font-medium text-gray-700">Title</label>
                      <input id="assessmentTitle" v-model="newAssessment.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label for="assessmentDesc" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea id="assessmentDesc" v-model="newAssessment.description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label for="assessmentWeightage" class="block text-sm font-medium text-gray-700">Weightage (%)</label>
                        <input id="assessmentWeightage" v-model.number="newAssessment.weightage" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label for="assessmentTotalMarks" class="block text-sm font-medium text-gray-700">Total Marks</label>
                        <input id="assessmentTotalMarks" v-model.number="newAssessment.totalMarks" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <button type="submit" class="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700">Save Assessment</button>
                  </form>
                  <p v-if="assessmentMessage" class="mt-3 text-sm text-orange-700">{{ assessmentMessage }}</p>
                </div>
                <div class="bg-teal-50 p-4 rounded-lg shadow-sm col-span-full">
                  <h3 class="font-semibold text-lg mb-2 text-teal-800">Class Performance Analytics (Placeholder)</h3>
                  <div class="h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                    [Bar/Line Chart for Grades Distribution]
                  </div>
                  <p class="text-sm text-gray-600 mt-2">Average Grade: 78.5%</p>
                </div>
              </div>
            </div>

            <!-- Academic Advisor UI -->
            <div v-else-if="userRole === 'advisor'">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Academic Advisor Dashboard</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-indigo-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-indigo-800">Advisees Overview</h3>
                  <ul class="space-y-2 text-sm text-gray-700">
                    <li v-for="advisee in advisorData.advisees" :key="advisee.id" class="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                      <span>{{ advisee.name }} ({{ advisee.matricNo }}) - GPA: {{ advisee.gpa }}</span>
                      <span :class="['px-2 py-1 rounded-full text-xs font-semibold', advisee.atRisk ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800']">
                        {{ advisee.atRisk ? 'At-Risk' : 'Good Standing' }}
                      </span>
                      <button @click="viewAdvisee(advisee.id)" class="text-blue-600 hover:underline text-xs">View</button>
                    </li>
                  </ul>
                </div>
                <div class="bg-pink-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-pink-800">Meeting Records</h3>
                  <form @submit.prevent="addMeetingRecord" class="space-y-3">
                    <div>
                      <label for="meetingStudent" class="block text-sm font-medium text-gray-700">Student</label>
                      <select id="meetingStudent" v-model="newMeeting.studentId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select student</option>
                        <option v-for="advisee in advisorData.advisees" :key="advisee.id" :value="advisee.id">{{ advisee.name }}</option>
                      </select>
                    </div>
                    <div>
                      <label for="meetingNotes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea id="meetingNotes" v-model="newMeeting.notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Meeting notes and recommendations..."></textarea>
                    </div>
                    <button type="submit" class="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700">Add Record</button>
                  </form>
                  <p v-if="meetingMessage" class="mt-3 text-sm text-pink-700">{{ meetingMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Admin UI -->
            <div v-else-if="userRole === 'admin'">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 class="font-semibold text-lg mb-2 text-gray-800">User Management</h3>
                  <input type="text" v-model="userSearch" placeholder="Search users..." class="w-full px-3 py-2 border border-gray-300 rounded-md mb-3" />
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

            <!-- Default/Welcome Panel -->
            <div v-else>
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Welcome to StudyFlow!</h2>
              <p class="text-gray-600">Select an option from the sidebar to get started.</p>
            </div>
          </div>
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  HomeIcon, BookOpenIcon, UsersIcon, ChartBarIcon,
  ClipboardListIcon, GraduationCapIcon, SettingsIcon,
  ShieldCheckIcon, FileTextIcon, CalendarIcon,
  BarChartIcon, LineChartIcon,
} from 'lucide-vue-next';

// --- State Management (Simplified for single file) ---
const isAuthenticated = ref(false);
const userRole = ref('guest'); // 'guest', 'student', 'lecturer', 'advisor', 'admin'
const identifier = ref('');
const password = ref('');
const loginError = ref('');
const rememberMe = ref(false);
const currentPage = ref('dashboard'); // Controls which main panel content is shown

// UI State
const isSidebarOpen = ref(false);
const showProfileMenu = ref(false);
const showNotifications = ref(false);

// Mock User Data (for login simulation)
const mockUsers = {
  'student123': { password: 'password', role: 'student', name: 'Alice Smith', matricNo: 'S1234567A', avatar: '/placeholder.svg?height=32&width=32' },
  'lecturer@example.com': { password: 'password', role: 'lecturer', name: 'Dr. John Doe', avatar: '/placeholder.svg?height=32&width=32' },
  'advisor@example.com': { password: 'password', role: 'advisor', name: 'Ms. Jane Roe', avatar: '/placeholder.svg?height=32&width=32' },
  'admin@example.com': { password: 'password', role: 'admin', name: 'Admin User', avatar: '/placeholder.svg?height=32&width=32' },
};

// User Profile Data (dynamically set after login)
const userProfile = ref({
  name: '',
  matricNo: '', // Only for students
  avatar: '/placeholder.svg?height=32&width=32',
});

// Notifications
const notifications = ref([
  { id: 1, message: 'Marks for Quiz 1 updated in Calculus.' },
  { id: 2, message: 'New assignment posted for Linear Algebra.' },
]);

// --- Computed Properties for Dynamic UI ---

const loginType = computed(() => {
  // Simple heuristic: if identifier looks like an email, assume email login
  return identifier.value.includes('@') ? 'email' : 'student';
});

const sidebarNav = computed(() => {
  const baseNav = [
    { name: 'Dashboard', link: '#dashboard', icon: HomeIcon, page: 'dashboard' },
    { name: 'Settings', link: '#settings', icon: SettingsIcon, page: 'settings' },
  ];

  switch (userRole.value) {
    case 'student':
      return [
        ...baseNav,
        { name: 'Progress Tracker', link: '#progress', icon: ChartBarIcon, page: 'progress' },
        { name: 'What-If Tool', link: '#whatif', icon: BarChartIcon, page: 'whatif' },
        { name: 'Remark Requests', link: '#remarks', icon: FileTextIcon, page: 'remarks' },
      ];
    case 'lecturer':
      return [
        ...baseNav,
        { name: 'Course Management', link: '#courses', icon: BookOpenIcon, page: 'courses' },
        { name: 'Student Records', link: '#records', icon: UsersIcon, page: 'records' },
        { name: 'Analytics', link: '#analytics', icon: LineChartIcon, page: 'analytics' },
      ];
    case 'advisor':
      return [
        ...baseNav,
        { name: 'Advisees', link: '#advisees', icon: GraduationCapIcon, page: 'advisees' },
        { name: 'Reports', link: '#reports', icon: ClipboardListIcon, page: 'reports' },
        { name: 'Meeting Records', link: '#meetings', icon: CalendarIcon, page: 'meetings' },
      ];
    case 'admin':
      return [
        ...baseNav,
        { name: 'User Management', link: '#users', icon: ShieldCheckIcon, page: 'users' },
        { name: 'System Logs', link: '#logs', icon: FileTextIcon, page: 'logs' },
      ];
    default:
      return [];
  }
});

// --- Mock Data for Dashboards ---

const studentData = ref({
  marks: [
    { component: 'Quiz 1', score: 18, total: 20, weightage: 10 },
    { component: 'Assignment 1', score: 45, total: 50, weightage: 20 },
    { component: 'Midterm Exam', score: 70, total: 100, weightage: 30 },
    { component: 'Final Exam', score: 0, total: 100, weightage: 40 }, // Placeholder for future
  ],
  courses: [
    { name: 'Calculus I', progress: 75 },
    { name: 'Linear Algebra', progress: 60 },
    { name: 'Programming Fundamentals', progress: 90 },
  ],
  rank: 15,
  percentile: 85,
  totalPeers: 100,
  totalGrade: computed(() => {
    const totalWeightedScore = studentData.value.marks.reduce((sum, mark) => {
      if (mark.score > 0) { // Only count if score is entered
        return sum + (mark.score / mark.total) * mark.weightage;
      }
      return sum;
    }, 0);
    const totalWeightage = studentData.value.marks.reduce((sum, mark) => sum + mark.weightage, 0);
    return totalWeightage > 0 ? (totalWeightedScore / totalWeightage * 100).toFixed(2) : '0.00';
  }),
});

const lecturerData = ref({
  students: [
    { id: 1, name: 'Alice Smith', matricNo: 'S1234567A', overallGrade: 88.5 },
    { id: 2, name: 'Bob Johnson', matricNo: 'S1234567B', overallGrade: 72.1 },
    { id: 3, name: 'Charlie Brown', matricNo: 'S1234567C', overallGrade: 91.0 },
  ],
});

const advisorData = ref({
  advisees: [
    { id: 101, name: 'David Lee', matricNo: 'S9876543D', gpa: 3.5, atRisk: false },
    { id: 102, name: 'Eve White', matricNo: 'S9876543E', gpa: 1.8, atRisk: true },
    { id: 103, name: 'Frank Green', matricNo: 'S9876543F', gpa: 2.9, atRisk: false },
  ],
});

const adminData = ref({
  users: [
    { id: 1, name: 'Alice Smith', role: 'student', active: true },
    { id: 2, name: 'Dr. John Doe', role: 'lecturer', active: true },
    { id: 3, name: 'Ms. Jane Roe', role: 'advisor', active: true },
    { id: 4, name: 'Admin User', role: 'admin', active: true },
    { id: 5, name: 'Inactive Student', role: 'student', active: false },
  ],
});

// --- Form States ---
const remarkRequest = ref({
  assessment: '',
  reason: '',
});
const remarkMessage = ref('');

const newAssessment = ref({
  title: '',
  description: '',
  weightage: 0,
  totalMarks: 0,
});
const assessmentMessage = ref('');

const newMeeting = ref({
  studentId: '',
  notes: '',
});
const meetingMessage = ref('');

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

// --- Methods ---

const handleLogin = () => {
  loginError.value = '';
  const user = mockUsers[identifier.value];

  if (user && user.password === password.value) {
    isAuthenticated.value = true;
    userRole.value = user.role;
    userProfile.value.name = user.name;
    userProfile.value.avatar = user.avatar;
    if (user.matricNo) {
      userProfile.value.matricNo = user.matricNo;
    }
    isSidebarOpen.value = true; // Open sidebar on login
    currentPage.value = 'dashboard'; // Default to dashboard after login
  } else {
    loginError.value = 'Invalid credentials. Please try again.';
  }
};

const handleLogout = () => {
  isAuthenticated.value = false;
  userRole.value = 'guest';
  identifier.value = '';
  password.value = '';
  loginError.value = '';
  showProfileMenu.value = false;
  showNotifications.value = false;
  isSidebarOpen.value = false;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
  showNotifications.value = false; // Close other menus
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showProfileMenu.value = false; // Close other menus
};

const submitRemarkRequest = () => {
  if (remarkRequest.value.assessment && remarkRequest.value.reason) {
    remarkMessage.value = `Remark request for "${remarkRequest.value.assessment}" submitted successfully!`;
    // In a real app, send this to backend
    remarkRequest.value.assessment = '';
    remarkRequest.value.reason = '';
  } else {
    remarkMessage.value = 'Please select an assessment and provide a reason.';
  }
};

const saveAssessment = () => {
  if (newAssessment.value.title && newAssessment.value.weightage > 0 && newAssessment.value.totalMarks > 0) {
    assessmentMessage.value = `Assessment "${newAssessment.value.title}" saved successfully!`;
    // In a real app, send this to backend and update course data
    newAssessment.value = { title: '', description: '', weightage: 0, totalMarks: 0 };
    // Simulate notification to students
    notifications.value.push({ id: Date.now(), message: `New assessment "${newAssessment.value.title}" added!` });
  } else {
    assessmentMessage.value = 'Please fill all assessment fields correctly.';
  }
};

const viewStudent = (studentId) => {
  alert(`Viewing/Editing student with ID: ${studentId}`);
  // In a real app, navigate to student profile page
};

const addMeetingRecord = () => {
  if (newMeeting.value.studentId && newMeeting.value.notes) {
    const studentName = advisorData.value.advisees.find(a => a.id === newMeeting.value.studentId)?.name;
    meetingMessage.value = `Meeting record for ${studentName} added successfully!`;
    // In a real app, send this to backend
    newMeeting.value = { studentId: '', notes: '' };
  } else {
    meetingMessage.value = 'Please select a student and add notes.';
  }
};

const viewAdvisee = (adviseeId) => {
  alert(`Viewing advisee with ID: ${adviseeId}`);
  // In a real app, navigate to advisee profile page
};

const resetPassword = (userId) => {
  alert(`Resetting password for user ID: ${userId}`);
  // In a real app, send reset request to backend
};

const toggleUserStatus = (userId) => {
  const user = adminData.value.users.find(u => u.id === userId);
  if (user) {
    user.active = !user.active;
    alert(`User ${user.name} is now ${user.active ? 'activated' : 'deactivated'}.`);
    // In a real app, update user status in backend
  }
};

// Close menus when clicking outside
watch([showProfileMenu, showNotifications], () => {
  if (showProfileMenu.value || showNotifications.value) {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) { // Adjust selector if needed
        showProfileMenu.value = false;
        showNotifications.value = false;
        document.removeEventListener('click', handleClickOutside);
      }
    };
    document.addEventListener('click', handleClickOutside);
  }
});

</script>

<style scoped>
/* Base styles for the overall layout */
.min-h-screen {
  min-height: 100vh;
}

/* Responsive sidebar */
@media (max-width: 767px) {
  aside {
    width: 100%;
    max-width: 16rem; /* Match w-64 */
    height: 100vh;
    top: 0;
    left: 0;
    padding-top: 4rem; /* Account for fixed navbar */
  }
  main {
    margin-left: 0 !important; /* Override ml-64 on mobile */
  }
}
</style>
