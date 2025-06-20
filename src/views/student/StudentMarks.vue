<template>
  <div class="dashboard-layout">
    <NavigationSidebar :navigation-items="navigationItems" />

    <main class="main-content">
      <TopHeader 
        title="Marks & Performance" 
        :notification-count="3"
      />

      <div class="marks-content">
        <div class="course-tabs">
          <button v-for="course in courses" :key="course.id"
                  @click="selectedCourse = course.id"
                  :class="['course-tab', { active: selectedCourse === course.id }]">
            {{ course.name }}
          </button>
        </div>

        <div class="marks-overview">
          <div class="course-summary">
            <h3>{{ getCurrentCourse()?.name }}</h3>
            <div class="summary-stats">
              <div class="summary-item">
                <span>Total Marks</span>
                <strong>{{ getCurrentCourse()?.totalMarks }}/100</strong>
              </div>
              <div class="summary-item">
                <span>Current Grade</span>
                <strong class="text-primary">{{ getCurrentCourse()?.grade }}</strong>
              </div>
              <div class="summary-item">
                <span>Class Average</span>
                <strong>{{ getCurrentCourse()?.classAverage }}/100</strong>
              </div>
              <div class="summary-item">
                <span>Class Rank</span>
                <strong>{{ getCurrentCourse()?.rank }}</strong>
              </div>
            </div>
          </div>

          <div class="marks-breakdown">
            <h4>Assessment Breakdown</h4>
            <div class="assessment-list">
              <div v-for="assessment in getCurrentCourse()?.assessments" :key="assessment.id" 
                   class="assessment-item">
                <div class="assessment-info">
                  <h5>{{ assessment.name }}</h5>
                  <span class="assessment-weight">{{ assessment.weight }}%</span>
                </div>
                <div class="assessment-marks">
                  <span class="marks-obtained">{{ assessment.obtained }}</span>
                  <span class="marks-total">/{{ assessment.total }}</span>
                  <div class="marks-bar">
                    <div class="marks-fill" 
                         :style="{ width: (assessment.obtained / assessment.total * 100) + '%' }"></div>
                  </div>
                  <span class="percentage">{{ Math.round((assessment.obtained / assessment.total) * 100) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="performance-comparison">
            <h4>Performance vs Class Average</h4>
            <div class="comparison-chart">
              <div v-for="assessment in getCurrentCourse()?.assessments" :key="assessment.id" 
                   class="comparison-item">
                <div class="assessment-name">{{ assessment.name }}</div>
                <div class="comparison-bars">
                  <div class="bar-container">
                    <div class="bar your-bar" 
                         :style="{ width: (assessment.obtained / assessment.total * 100) + '%' }">
                      <span class="bar-label">You: {{ Math.round((assessment.obtained / assessment.total) * 100) }}%</span>
                    </div>
                  </div>
                  <div class="bar-container">
                    <div class="bar class-bar" 
                         :style="{ width: assessment.classAverage + '%' }">
                      <span class="bar-label">Class: {{ assessment.classAverage }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grade-prediction">
            <h4>Grade Prediction</h4>
            <div class="prediction-content">
              <div class="current-standing">
                <div class="standing-item">
                  <span>Current Total</span>
                  <strong>{{ getCurrentCourse()?.totalMarks }}%</strong>
                </div>
                <div class="standing-item">
                  <span>Remaining Weight</span>
                  <strong>{{ getCurrentCourse()?.remainingWeight }}%</strong>
                </div>
                <div class="standing-item">
                  <span>Projected Grade</span>
                  <strong class="text-primary">{{ getCurrentCourse()?.projectedGrade }}</strong>
                </div>
              </div>
              <div class="grade-scenarios">
                <h5>What if scenarios:</h5>
                <div class="scenario-list">
                  <div class="scenario-item">
                    <span>If you score 90% on remaining assessments:</span>
                    <strong class="text-secondary">A-</strong>
                  </div>
                  <div class="scenario-item">
                    <span>If you score 80% on remaining assessments:</span>
                    <strong class="text-primary">B+</strong>
                  </div>
                  <div class="scenario-item">
                    <span>If you score 70% on remaining assessments:</span>
                    <strong>B</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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

const selectedCourse = ref(1)

const courses = ref([
  {
    id: 1,
    name: 'Data Structures & Algorithms',
    totalMarks: 78,
    grade: 'B+',
    classAverage: 72,
    rank: '8th of 45',
    remainingWeight: 30,
    projectedGrade: 'B+',
    assessments: [
      { id: 1, name: 'Quiz 1', weight: 10, obtained: 18, total: 20, classAverage: 75 },
      { id: 2, name: 'Assignment 1', weight: 15, obtained: 14, total: 15, classAverage: 80 },
      { id: 3, name: 'Quiz 2', weight: 10, obtained: 16, total: 20, classAverage: 70 },
      { id: 4, name: 'Assignment 2', weight: 15, obtained: 13, total: 15, classAverage: 78 },
      { id: 5, name: 'Mid-term Exam', weight: 20, obtained: 17, total: 20, classAverage: 72 },
      { id: 6, name: 'Final Exam', weight: 30, obtained: 0, total: 30, classAverage: 0 }
    ]
  },
  {
    id: 2,
    name: 'Software Engineering',
    totalMarks: 85,
    grade: 'A-',
    classAverage: 79,
    rank: '5th of 38',
    remainingWeight: 30,
    projectedGrade: 'A-',
    assessments: [
      { id: 7, name: 'Project Phase 1', weight: 20, obtained: 18, total: 20, classAverage: 82 },
      { id: 8, name: 'Quiz 1', weight: 10, obtained: 9, total: 10, classAverage: 85 },
      { id: 9, name: 'Assignment 1', weight: 15, obtained: 14, total: 15, classAverage: 88 },
      { id: 10, name: 'Mid-term Exam', weight: 25, obtained: 22, total: 25, classAverage: 75 },
      { id: 11, name: 'Final Exam', weight: 30, obtained: 0, total: 30, classAverage: 0 }
    ]
  },
  {
    id: 3,
    name: 'Database Systems',
    totalMarks: 72,
    grade: 'B',
    classAverage: 68,
    rank: '12th of 42',
    remainingWeight: 40,
    projectedGrade: 'B',
    assessments: [
      { id: 12, name: 'Lab Assignment 1', weight: 15, obtained: 12, total: 15, classAverage: 70 },
      { id: 13, name: 'Quiz 1', weight: 10, obtained: 8, total: 10, classAverage: 65 },
      { id: 14, name: 'Project Proposal', weight: 15, obtained: 13, total: 15, classAverage: 72 },
      { id: 15, name: 'Mid-term Exam', weight: 20, obtained: 15, total: 20, classAverage: 68 },
      { id: 16, name: 'Final Project', weight: 25, obtained: 0, total: 25, classAverage: 0 },
      { id: 17, name: 'Final Exam', weight: 15, obtained: 0, total: 15, classAverage: 0 }
    ]
  }
])

const getCurrentCourse = () => {
  return courses.value.find(course => course.id === selectedCourse.value)
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

.marks-content {
  padding: 32px;
}

.course-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.course-tab {
  padding: 12px 24px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  border: 2px solid transparent;
}

.course-tab.active {
  background: var(--royal-blue);
  color: white;
}

.course-tab:hover:not(.active) {
  border-color: var(--royal-blue);
}

.marks-overview {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.course-summary {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.course-summary h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: var(--dark-charcoal);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item span {
  color: var(--warm-gray);
  font-size: 14px;
}

.summary-item strong {
  font-size: 20px;
  font-weight: 700;
}

.marks-breakdown, .performance-comparison, .grade-prediction {
  margin-bottom: 32px;
}

.marks-breakdown h4, .performance-comparison h4, .grade-prediction h4 {
  margin-bottom: 20px;
  color: var(--dark-charcoal);
}

.assessment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F3F4F6;
}

.assessment-item:last-child {
  border-bottom: none;
}

.assessment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.assessment-info h5 {
  color: var(--dark-charcoal);
  margin: 0;
}

.assessment-weight {
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--warm-gray);
}

.assessment-marks {
  display: flex;
  align-items: center;
  gap: 12px;
}

.marks-obtained {
  font-weight: 700;
  font-size: 18px;
  color: var(--dark-charcoal);
}

.marks-total {
  color: var(--warm-gray);
}

.marks-bar {
  width: 100px;
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.marks-fill {
  height: 100%;
  background: var(--emerald-green);
  transition: width 0.3s ease;
}

.percentage {
  font-weight: 600;
  color: var(--dark-charcoal);
  min-width: 40px;
}

.comparison-item {
  margin-bottom: 20px;
}

.assessment-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

.comparison-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-container {
  position: relative;
  height: 24px;
  background: #F3F4F6;
  border-radius: 12px;
  overflow: hidden;
}

.bar {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 12px;
  transition: width 0.3s ease;
}

.your-bar {
  background: var(--royal-blue);
  color: white;
}

.class-bar {
  background: var(--warm-gray);
  color: white;
}

.bar-label {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.prediction-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.current-standing {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.standing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.standing-item span {
  color: var(--warm-gray);
}

.standing-item strong {
  font-weight: 700;
}

.grade-scenarios h5 {
  margin-bottom: 16px;
  color: var(--dark-charcoal);
}

.scenario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.scenario-item:last-child {
  border-bottom: none;
}

.scenario-item span {
  color: var(--dark-charcoal);
  font-size: 14px;
}

.scenario-item strong {
  font-weight: 700;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .summary-stats {
    grid-template-columns: 1fr 1fr;
  }
  
  .assessment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .prediction-content {
    grid-template-columns: 1fr;
  }
  
  .comparison-bars {
    margin-top: 8px;
  }
}
</style>