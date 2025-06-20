<template>
  <div class="dashboard-layout">
    <NavigationSidebar :navigation-items="navigationItems" />

    <main class="main-content">
      <TopHeader title="Grade Simulator" />

      <div class="simulator-content">
        <div class="simulator-header">
          <h2>What-If Grade Simulator</h2>
          <p>Adjust your expected scores to see how they affect your final grade</p>
        </div>

        <div class="course-selector">
          <label>Select Course:</label>
          <select v-model="selectedCourse" class="input-field">
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
        </div>

        <div class="simulator-grid">
          <div class="assessments-panel">
            <h3>Adjust Assessment Scores</h3>
            <div class="assessment-sliders">
              <div v-for="assessment in getCurrentCourse()?.assessments" :key="assessment.id" 
                   class="slider-item">
                <div class="slider-header">
                  <label>{{ assessment.name }} ({{ assessment.weight }}%)</label>
                  <div class="current-score">
                    <span v-if="assessment.obtained > 0">Current: {{ assessment.obtained }}/{{ assessment.total }}</span>
                    <span v-else class="pending">Pending</span>
                  </div>
                </div>
                <div class="slider-container">
                  <input 
                    type="range" 
                    :min="0" 
                    :max="assessment.total"
                    v-model="simulatedScores[assessment.id]"
                    class="score-slider"
                    :disabled="assessment.obtained > 0"
                  />
                  <div class="slider-values">
                    <span>0</span>
                    <span class="simulated-value">
                      {{ simulatedScores[assessment.id] }}/{{ assessment.total }}
                      ({{ Math.round((simulatedScores[assessment.id] / assessment.total) * 100) }}%)
                    </span>
                    <span>{{ assessment.total }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="results-panel">
            <h3>Simulation Results</h3>
            <div class="results-summary">
              <div class="result-card current">
                <h4>Current Grade</h4>
                <div class="grade-display">{{ getCurrentCourse()?.grade }}</div>
                <div class="score-display">{{ getCurrentCourse()?.totalMarks }}%</div>
              </div>

              <div class="result-card simulated">
                <h4>Simulated Grade</h4>
                <div class="grade-display" :class="getGradeClass(simulatedGrade)">{{ simulatedGrade }}</div>
                <div class="score-display">{{ simulatedTotal }}%</div>
              </div>
            </div>

            <div class="grade-breakdown">
              <h4>Grade Breakdown</h4>
              <div class="breakdown-list">
                <div v-for="assessment in getCurrentCourse()?.assessments" :key="assessment.id" 
                     class="breakdown-item">
                  <span class="assessment-name">{{ assessment.name }}</span>
                  <span class="weight">{{ assessment.weight }}%</span>
                  <span class="contribution">
                    {{ calculateContribution(assessment.id) }}%
                  </span>
                </div>
                <div class="breakdown-total">
                  <span class="assessment-name"><strong>Total</strong></span>
                  <span class="weight"><strong>100%</strong></span>
                  <span class="contribution"><strong>{{ simulatedTotal }}%</strong></span>
                </div>
              </div>
            </div>

            <div class="grade-scenarios">
              <h4>Grade Scenarios</h4>
              <div class="scenario-grid">
                <div class="scenario-card">
                  <h5>To get an A (90%)</h5>
                  <p class="scenario-text">{{ getScenarioText(90) }}</p>
                </div>
                <div class="scenario-card">
                  <h5>To get a B+ (85%)</h5>
                  <p class="scenario-text">{{ getScenarioText(85) }}</p>
                </div>
                <div class="scenario-card">
                  <h5>To get a B (80%)</h5>
                  <p class="scenario-text">{{ getScenarioText(80) }}</p>
                </div>
                <div class="scenario-card">
                  <h5>To pass (50%)</h5>
                  <p class="scenario-text">{{ getScenarioText(50) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-secondary" @click="resetSimulation">
            Reset to Current Scores
          </button>
          <button class="btn-primary" @click="saveSimulation">
            Save Simulation
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
import TopHeader from '@/components/TopHeader.vue'

const navigationItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/student/marks', label: 'Marks & Performance', icon: '📊' },
  { path: '/student/simulator', label: 'Grade Simulator', icon: '🧮' },
  { path: '/student/feedback', label: 'Feedback & Requests', icon: '💬' }
]

const selectedCourse = ref(1)
const simulatedScores = ref({})

const courses = ref([
  {
    id: 1,
    name: 'Data Structures & Algorithms',
    totalMarks: 78,
    grade: 'B+',
    assessments: [
      { id: 1, name: 'Quiz 1', weight: 10, obtained: 18, total: 20 },
      { id: 2, name: 'Assignment 1', weight: 15, obtained: 14, total: 15 },
      { id: 3, name: 'Quiz 2', weight: 10, obtained: 16, total: 20 },
      { id: 4, name: 'Assignment 2', weight: 15, obtained: 13, total: 15 },
      { id: 5, name: 'Mid-term Exam', weight: 20, obtained: 17, total: 20 },
      { id: 6, name: 'Final Exam', weight: 30, obtained: 0, total: 30 }
    ]
  },
  {
    id: 2,
    name: 'Software Engineering',
    totalMarks: 85,
    grade: 'A-',
    assessments: [
      { id: 7, name: 'Project Phase 1', weight: 20, obtained: 18, total: 20 },
      { id: 8, name: 'Quiz 1', weight: 10, obtained: 9, total: 10 },
      { id: 9, name: 'Assignment 1', weight: 15, obtained: 14, total: 15 },
      { id: 10, name: 'Mid-term Exam', weight: 25, obtained: 22, total: 25 },
      { id: 11, name: 'Final Exam', weight: 30, obtained: 0, total: 30 }
    ]
  }
])

const getCurrentCourse = () => {
  return courses.value.find(course => course.id === selectedCourse.value)
}

const initializeSimulation = () => {
  const course = getCurrentCourse()
  if (course) {
    course.assessments.forEach(assessment => {
      simulatedScores.value[assessment.id] = assessment.obtained || Math.round(assessment.total * 0.7)
    })
  }
}

const simulatedTotal = computed(() => {
  const course = getCurrentCourse()
  if (!course) return 0
  
  let total = 0
  course.assessments.forEach(assessment => {
    const score = simulatedScores.value[assessment.id] || 0
    const percentage = (score / assessment.total) * 100
    total += (percentage * assessment.weight) / 100
  })
  
  return Math.round(total)
})

const simulatedGrade = computed(() => {
  const total = simulatedTotal.value
  if (total >= 90) return 'A+'
  if (total >= 85) return 'A'
  if (total >= 80) return 'A-'
  if (total >= 75) return 'B+'
  if (total >= 70) return 'B'
  if (total >= 65) return 'B-'
  if (total >= 60) return 'C+'
  if (total >= 55) return 'C'
  if (total >= 50) return 'C-'
  return 'F'
})

const calculateContribution = (assessmentId) => {
  const course = getCurrentCourse()
  const assessment = course?.assessments.find(a => a.id === assessmentId)
  if (!assessment) return 0
  
  const score = simulatedScores.value[assessmentId] || 0
  const percentage = (score / assessment.total) * 100
  return Math.round((percentage * assessment.weight) / 100 * 100) / 100
}

const getGradeClass = (grade) => {
  if (['A+', 'A', 'A-'].includes(grade)) return 'grade-excellent'
  if (['B+', 'B', 'B-'].includes(grade)) return 'grade-good'
  if (['C+', 'C', 'C-'].includes(grade)) return 'grade-average'
  return 'grade-poor'
}

const getScenarioText = (targetPercentage) => {
  const course = getCurrentCourse()
  if (!course) return 'No course selected'
  
  const pendingAssessments = course.assessments.filter(a => a.obtained === 0)
  if (pendingAssessments.length === 0) return 'No pending assessments'
  
  const currentTotal = course.assessments
    .filter(a => a.obtained > 0)
    .reduce((sum, a) => sum + ((a.obtained / a.total) * a.weight), 0)
  
  const remainingWeight = pendingAssessments.reduce((sum, a) => sum + a.weight, 0)
  const neededPoints = targetPercentage - currentTotal
  const requiredAverage = (neededPoints / remainingWeight) * 100
  
  if (requiredAverage > 100) {
    return 'Not achievable with remaining assessments'
  } else if (requiredAverage < 0) {
    return 'Already achieved!'
  } else {
    return `Need ${Math.round(requiredAverage)}% average on remaining assessments`
  }
}

const resetSimulation = () => {
  initializeSimulation()
}

const saveSimulation = () => {
  console.log('Simulation saved:', simulatedScores.value)
  alert('Simulation saved successfully!')
}

// Initialize simulation when component mounts or course changes
watch(selectedCourse, initializeSimulation, { immediate: true })
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

.simulator-content {
  padding: 32px;
}

.simulator-header {
  margin-bottom: 32px;
}

.simulator-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
}

.simulator-header p {
  color: var(--warm-gray);
  font-size: 16px;
}

.course-selector {
  margin-bottom: 32px;
}

.course-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark-charcoal);
}

.simulator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.assessments-panel, .results-panel {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.assessments-panel h3, .results-panel h3 {
  margin-bottom: 20px;
  color: var(--dark-charcoal);
}

.slider-item {
  margin-bottom: 24px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.slider-header label {
  font-weight: 600;
  color: var(--dark-charcoal);
}

.current-score {
  font-size: 14px;
}

.current-score .pending {
  color: var(--warm-gray);
  font-style: italic;
}

.slider-container {
  margin-bottom: 8px;
}

.score-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #E5E7EB;
  outline: none;
  -webkit-appearance: none;
}

.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--royal-blue);
  cursor: pointer;
}

.score-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--royal-blue);
  cursor: pointer;
  border: none;
}

.score-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--warm-gray);
}

.simulated-value {
  font-weight: 600;
  color: var(--royal-blue);
}

.results-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.result-card {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.result-card.current {
  background: #F3F4F6;
  border: 2px solid #E5E7EB;
}

.result-card.simulated {
  background: #EBF4FF;
  border: 2px solid var(--royal-blue);
}

.result-card h4 {
  margin-bottom: 12px;
  color: var(--dark-charcoal);
}

.grade-display {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.grade-display.grade-excellent {
  color: var(--emerald-green);
}

.grade-display.grade-good {
  color: var(--royal-blue);
}

.grade-display.grade-average {
  color: #D97706;
}

.grade-display.grade-poor {
  color: var(--crimson-red);
}

.score-display {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-charcoal);
}

.grade-breakdown {
  margin-bottom: 24px;
}

.grade-breakdown h4 {
  margin-bottom: 16px;
  color: var(--dark-charcoal);
}

.breakdown-item, .breakdown-total {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.breakdown-total {
  border-top: 2px solid var(--dark-charcoal);
  border-bottom: none;
  margin-top: 8px;
  padding-top: 12px;
}

.assessment-name {
  color: var(--dark-charcoal);
}

.weight {
  color: var(--warm-gray);
  text-align: center;
}

.contribution {
  color: var(--royal-blue);
  font-weight: 600;
  text-align: right;
}

.grade-scenarios h4 {
  margin-bottom: 16px;
  color: var(--dark-charcoal);
}

.scenario-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.scenario-card {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.scenario-card h5 {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
  font-size: 14px;
}

.scenario-text {
  font-size: 12px;
  color: var(--warm-gray);
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .simulator-grid {
    grid-template-columns: 1fr;
  }
  
  .results-summary {
    flex-direction: column;
  }
  
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>