<template>
  <div class="dashboard-layout">
    <NavigationSidebar :navigation-items="navigationItems" />

    <main class="main-content">
      <TopHeader 
        title="Student Dashboard" 
        :notification-count="3"
        @notifications="showNotifications"
        @profile="showProfile"
      />

      <div class="dashboard-content">
        <div class="welcome-section">
          <h2>Welcome back, {{ currentUser?.name }}! 👋</h2>
          <p>Here's your academic overview for this semester</p>
        </div>

        <div class="stats-grid">
          <StatCard
            title="Current GPA"
            :value="studentData.gpa"
            change="+0.12 from last semester"
            change-type="positive"
            value-type="primary"
          />
          <StatCard
            title="Class Rank"
            :value="studentData.rank"
            change="out of 45 students"
            value-type="secondary"
          />
          <StatCard
            title="Completed Assessments"
            :value="`${studentData.completedAssessments}/${studentData.totalAssessments}`"
            change="3 pending submissions"
          />
          <StatCard
            title="Overall Progress"
            :value="`${studentData.overallProgress}%`"
            change="On track for graduation"
            :show-progress="true"
            :progress-percent="studentData.overallProgress"
          />
        </div>

        <div class="content-grid">
          <div class="upcoming-section">
            <h3>Upcoming Deadlines</h3>
            <div class="deadline-list">
              <div v-for="deadline in upcomingDeadlines" :key="deadline.id" class="deadline-item">
                <div class="deadline-info">
                  <h4>{{ deadline.title }}</h4>
                  <p>{{ deadline.course }}</p>
                </div>
                <div class="deadline-date" :class="deadline.urgency">
                  {{ deadline.dueDate }}
                </div>
              </div>
            </div>
            <div v-if="upcomingDeadlines.length === 0" class="empty-state">
              <p>🎉 No upcoming deadlines! You're all caught up.</p>
            </div>
          </div>

          <div class="recent-activity">
            <h3>Recent Activity</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  {{ activity.icon }}
                </div>
                <div class="activity-content">
                  <p>{{ activity.message }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-grid">
            <router-link to="/student/marks" class="action-card">
              <div class="action-icon">📊</div>
              <h4>View Marks</h4>
              <p>Check your latest grades and performance</p>
            </router-link>
            <router-link to="/student/simulator" class="action-card">
              <div class="action-icon">🧮</div>
              <h4>Grade Simulator</h4>
              <p>Predict your final grades</p>
            </router-link>
            <router-link to="/student/feedback" class="action-card">
              <div class="action-icon">💬</div>
              <h4>Request Feedback</h4>
              <p>Submit remark requests</p>
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
import TopHeader from '@/components/TopHeader.vue'
import StatCard from '@/components/StatCard.vue'

const currentUser = inject('currentUser')

const navigationItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/student/marks', label: 'Marks & Performance', icon: '📊' },
  { path: '/student/simulator', label: 'Grade Simulator', icon: '🧮' },
  { path: '/student/feedback', label: 'Feedback & Requests', icon: '💬' }
]

const studentData = ref({
  gpa: 3.67,
  rank: '8th',
  completedAssessments: 12,
  totalAssessments: 15,
  overallProgress: 80
})

const upcomingDeadlines = ref([
  { id: 1, title: 'Assignment 3', course: 'Data Structures', dueDate: '2 days', urgency: 'urgent' },
  { id: 2, title: 'Quiz 4', course: 'Algorithms', dueDate: '5 days', urgency: 'normal' },
  { id: 3, title: 'Project Proposal', course: 'Software Engineering', dueDate: '1 week', urgency: 'normal' }
])

const recentActivities = ref([
  { id: 1, type: 'grade', icon: '📊', message: 'New grade posted for Quiz 3 - Data Structures (85/100)', time: '2 hours ago' },
  { id: 2, type: 'feedback', icon: '💬', message: 'Feedback available for Assignment 2 - Algorithms', time: '1 day ago' },
  { id: 3, type: 'announcement', icon: '📢', message: 'Class rescheduled for tomorrow - Software Engineering', time: '2 days ago' },
  { id: 4, type: 'grade', icon: '📊', message: 'Midterm results published - Database Systems', time: '3 days ago' }
])

const showNotifications = () => {
  console.log('Show notifications')
}

const showProfile = () => {
  console.log('Show profile')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: var(--off-white);
  margin-left: 280px;
}

.dashboard-content {
  padding: 32px;
}

.welcome-section {
  margin-bottom: 32px;
}

.welcome-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
}

.welcome-section p {
  color: var(--warm-gray);
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.upcoming-section, .recent-activity {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.upcoming-section h3, .recent-activity h3 {
  margin-bottom: 20px;
  color: var(--dark-charcoal);
}

.deadline-item, .activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F3F4F6;
}

.deadline-item:last-child, .activity-item:last-child {
  border-bottom: none;
}

.deadline-info h4 {
  margin-bottom: 4px;
  color: var(--dark-charcoal);
}

.deadline-info p {
  color: var(--warm-gray);
  font-size: 14px;
}

.deadline-date {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.deadline-date.urgent {
  background: #FEE2E2;
  color: var(--crimson-red);
}

.deadline-date.normal {
  background: #EBF4FF;
  color: var(--royal-blue);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--warm-gray);
}

.activity-item {
  align-items: flex-start;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 16px;
}

.activity-icon.grade {
  background: #EBF4FF;
}

.activity-icon.feedback {
  background: #F0FDF4;
}

.activity-icon.announcement {
  background: #FEF3C7;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin-bottom: 4px;
  color: var(--dark-charcoal);
}

.activity-time {
  color: var(--warm-gray);
  font-size: 12px;
}

.quick-actions {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.quick-actions h3 {
  margin-bottom: 20px;
  color: var(--dark-charcoal);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  display: block;
  padding: 20px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  text-decoration: none;
  color: var(--dark-charcoal);
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  border-color: var(--royal-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.action-card h4 {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

.action-card p {
  color: var(--warm-gray);
  font-size: 14px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>