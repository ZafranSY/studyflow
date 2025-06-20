<template>
  <div class="dashboard-layout">
    <NavigationSidebar :navigation-items="navigationItems" />

    <main class="main-content">
      <TopHeader title="Feedback & Requests" />

      <div class="feedback-content">
        <div class="content-header">
          <h2>Feedback & Remark Requests</h2>
          <button class="btn-primary" @click="showRequestModal = true">
            + New Request
          </button>
        </div>

        <div class="feedback-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="['tab-btn', { active: activeTab === tab.value }]"
          >
            {{ tab.label }}
            <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="feedback-list">
          <div v-for="request in filteredRequests" :key="request.id" class="request-card">
            <div class="request-header">
              <div class="request-info">
                <h4>{{ request.title }}</h4>
                <div class="request-meta">
                  <span class="course">{{ request.course }}</span>
                  <span class="date">{{ request.date }}</span>
                </div>
              </div>
              <div class="request-status" :class="request.status">
                {{ getStatusLabel(request.status) }}
              </div>
            </div>
            
            <div class="request-content">
              <p><strong>Assessment:</strong> {{ request.assessment }}</p>
              <p><strong>Current Grade:</strong> {{ request.currentGrade }}</p>
              <p><strong>Reason:</strong> {{ request.reason }}</p>
            </div>

            <div v-if="request.response" class="request-response">
              <h5>Lecturer Response:</h5>
              <p>{{ request.response }}</p>
              <div v-if="request.newGrade" class="new-grade">
                <strong>Updated Grade: {{ request.newGrade }}</strong>
              </div>
            </div>

            <div class="request-actions">
              <button v-if="request.status === 'pending'" class="btn-outline" @click="editRequest(request.id)">
                Edit Request
              </button>
              <button v-if="request.status === 'pending'" class="btn-danger" @click="cancelRequest(request.id)">
                Cancel
              </button>
              <button v-if="request.status === 'resolved'" class="btn-secondary" @click="viewDetails(request.id)">
                View Details
              </button>
            </div>
          </div>

          <div v-if="filteredRequests.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No requests found</h3>
            <p>{{ getEmptyMessage() }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- New Request Modal -->
    <div v-if="showRequestModal" class="modal-overlay" @click="showRequestModal = false">
      <div class="modal-content" @click.stop>
        <h3>Submit Remark Request</h3>
        <form @submit.prevent="submitRequest">
          <div class="form-group">
            <label>Course</label>
            <select v-model="newRequest.course" class="input-field" required>
              <option value="">Select a course</option>
              <option v-for="course in availableCourses" :key="course.id" :value="course.name">
                {{ course.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Assessment</label>
            <select v-model="newRequest.assessment" class="input-field" required>
              <option value="">Select an assessment</option>
              <option v-for="assessment in availableAssessments" :key="assessment.id" :value="assessment.name">
                {{ assessment.name }} - Current Grade: {{ assessment.grade }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Request Type</label>
            <select v-model="newRequest.type" class="input-field" required>
              <option value="">Select request type</option>
              <option value="remark">Grade Remark</option>
              <option value="feedback">Additional Feedback</option>
              <option value="clarification">Grade Clarification</option>
              <option value="error">Grading Error</option>
            </select>
          </div>

          <div class="form-group">
            <label>Reason for Request</label>
            <textarea 
              v-model="newRequest.reason" 
              class="input-field" 
              rows="4" 
              placeholder="Please provide a detailed explanation for your request..."
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Supporting Evidence (Optional)</label>
            <textarea 
              v-model="newRequest.evidence" 
              class="input-field" 
              rows="3" 
              placeholder="Any additional evidence or references to support your request..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showRequestModal = false">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
import TopHeader from '@/components/TopHeader.vue'

const navigationItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/student/marks', label: 'Marks & Performance', icon: '📊' },
  { path: '/student/simulator', label: 'Grade Simulator', icon: '🧮' },
  { path: '/student/feedback', label: 'Feedback & Requests', icon: '💬' }
]

const activeTab = ref('all')
const showRequestModal = ref(false)

const tabs = [
  { value: 'all', label: 'All Requests', count: null },
  { value: 'pending', label: 'Pending', count: 2 },
  { value: 'resolved', label: 'Resolved', count: 3 },
  { value: 'rejected', label: 'Rejected', count: 1 }
]

const newRequest = ref({
  course: '',
  assessment: '',
  type: '',
  reason: '',
  evidence: ''
})

const availableCourses = ref([
  { id: 1, name: 'Data Structures & Algorithms' },
  { id: 2, name: 'Software Engineering' },
  { id: 3, name: 'Database Systems' }
])

const availableAssessments = ref([
  { id: 1, name: 'Quiz 1', grade: '90%' },
  { id: 2, name: 'Assignment 1', grade: '85%' },
  { id: 3, name: 'Mid-term Exam', grade: '78%' },
  { id: 4, name: 'Quiz 2', grade: '82%' }
])

const requests = ref([
  {
    id: 1,
    title: 'Grade Remark Request',
    course: 'Data Structures & Algorithms',
    assessment: 'Mid-term Exam',
    currentGrade: '78%',
    reason: 'I believe there was an error in the grading of question 3. My solution follows the correct algorithm as discussed in class.',
    date: '2024-01-15',
    status: 'pending',
    type: 'remark'
  },
  {
    id: 2,
    title: 'Additional Feedback Request',
    course: 'Software Engineering',
    assessment: 'Project Phase 1',
    currentGrade: '85%',
    reason: 'Could you provide more specific feedback on how to improve the design patterns implementation?',
    date: '2024-01-12',
    status: 'resolved',
    type: 'feedback',
    response: 'Your implementation of the Observer pattern was good, but consider using the Strategy pattern for the payment processing module. Also, add more comprehensive unit tests.',
    newGrade: null
  },
  {
    id: 3,
    title: 'Grade Clarification',
    course: 'Database Systems',
    assessment: 'Assignment 2',
    currentGrade: '72%',
    reason: 'I\'m not clear on why points were deducted for the normalization section. Could you clarify the specific issues?',
    date: '2024-01-10',
    status: 'resolved',
    type: 'clarification',
    response: 'Points were deducted because your 3NF normalization was incomplete. You missed identifying the transitive dependencies in the Customer table.',
    newGrade: null
  },
  {
    id: 4,
    title: 'Grading Error Report',
    course: 'Data Structures & Algorithms',
    assessment: 'Quiz 2',
    currentGrade: '65%',
    reason: 'I believe my answer for question 2 about binary search trees was marked incorrectly. The logic appears sound.',
    date: '2024-01-08',
    status: 'resolved',
    type: 'error',
    response: 'After review, you are correct. There was an error in the initial grading. Your grade has been updated.',
    newGrade: '85%'
  },
  {
    id: 5,
    title: 'Grade Remark Request',
    course: 'Software Engineering',
    assessment: 'Quiz 1',
    currentGrade: '70%',
    reason: 'The partial credit for question 4 seems insufficient given that my approach was correct but had a minor syntax error.',
    date: '2024-01-05',
    status: 'rejected',
    type: 'remark',
    response: 'The grading rubric clearly states that syntax errors result in significant point deduction for implementation questions. The original grade stands.'
  },
  {
    id: 6,
    title: 'Late Submission Consideration',
    course: 'Database Systems',
    assessment: 'Lab Report 1',
    currentGrade: '0%',
    reason: 'My submission was late due to a family emergency. I have documentation to support this.',
    date: '2024-01-03',
    status: 'pending',
    type: 'remark'
  }
])

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') {
    return requests.value
  }
  return requests.value.filter(request => request.status === activeTab.value)
})

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending Review',
    resolved: 'Resolved',
    rejected: 'Rejected'
  }
  return labels[status] || status
}

const getEmptyMessage = () => {
  const messages = {
    all: 'You haven\'t submitted any requests yet.',
    pending: 'No pending requests at the moment.',
    resolved: 'No resolved requests to show.',
    rejected: 'No rejected requests to show.'
  }
  return messages[activeTab.value] || 'No requests found.'
}

const submitRequest = () => {
  const request = {
    id: Date.now(),
    title: `${newRequest.value.type.charAt(0).toUpperCase() + newRequest.value.type.slice(1)} Request`,
    course: newRequest.value.course,
    assessment: newRequest.value.assessment,
    currentGrade: 'TBD',
    reason: newRequest.value.reason,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    type: newRequest.value.type
  }
  
  requests.value.unshift(request)
  
  // Reset form
  newRequest.value = {
    course: '',
    assessment: '',
    type: '',
    reason: '',
    evidence: ''
  }
  
  showRequestModal.value = false
  
  // Update tab counts
  const pendingCount = requests.value.filter(r => r.status === 'pending').length
  const pendingTab = tabs.find(t => t.value === 'pending')
  if (pendingTab) pendingTab.count = pendingCount
}

const editRequest = (requestId) => {
  console.log('Edit request:', requestId)
}

const cancelRequest = (requestId) => {
  const index = requests.value.findIndex(r => r.id === requestId)
  if (index !== -1) {
    requests.value.splice(index, 1)
    
    // Update tab counts
    const pendingCount = requests.value.filter(r => r.status === 'pending').length
    const pendingTab = tabs.find(t => t.value === 'pending')
    if (pendingTab) pendingTab.count = pendingCount
  }
}

const viewDetails = (requestId) => {
  console.log('View details:', requestId)
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

.feedback-content {
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.content-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-charcoal);
}

.feedback-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--warm-gray);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn.active {
  color: var(--royal-blue);
  border-bottom-color: var(--royal-blue);
}

.tab-count {
  background: var(--royal-blue);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.tab-btn.active .tab-count {
  background: white;
  color: var(--royal-blue);
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.request-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.request-info h4 {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

.request-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--warm-gray);
}

.course {
  font-weight: 500;
}

.request-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.request-status.pending {
  background: #FEF3C7;
  color: #D97706;
}

.request-status.resolved {
  background: #DCFCE7;
  color: var(--emerald-green);
}

.request-status.rejected {
  background: #FEE2E2;
  color: var(--crimson-red);
}

.request-content {
  margin-bottom: 16px;
}

.request-content p {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

.request-response {
  background: #F8FAFC;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid var(--royal-blue);
}

.request-response h5 {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

.request-response p {
  color: var(--dark-charcoal);
  margin-bottom: 8px;
}

.new-grade {
  padding: 8px 12px;
  background: #DCFCE7;
  border-radius: 6px;
  color: var(--emerald-green);
  font-size: 14px;
}

.request-actions {
  display: flex;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--warm-gray);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .feedback-tabs {
    flex-wrap: wrap;
  }
  
  .request-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .request-actions {
    flex-direction: column;
  }
}
</style>