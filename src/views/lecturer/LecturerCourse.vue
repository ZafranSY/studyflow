<template>
  <div class="dashboard-layout">
    <NavigationSidebar :navigation-items="navigationItems" />

    <main class="main-content">
      <TopHeader title="Course Management" />

      <div class="courses-content">
        <div class="course-selector">
          <select v-model="selectedCourse" class="input-field">
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }} ({{ course.code }})
            </option>
          </select>
        </div>

        <div class="course-management">
          <div class="management-tabs">
            <button v-for="tab in managementTabs" :key="tab.id"
                    @click="activeManagementTab = tab.id"
                    :class="['tab-btn', { active: activeManagementTab === tab.id }]">
              {{ tab.label }}
            </button>
          </div>

          <!-- Assessment Components -->
          <div v-if="activeManagementTab === 'components'" class="components-section">
            <div class="section-header">
              <h3>Assessment Components</h3>
              <button class="btn-primary" @click="showAddComponentModal = true">
                + Add Component
              </button>
            </div>

            <div class="components-list">
              <div v-for="component in getCurrentCourse()?.components" :key="component.id" 
                   class="component-card">
                <div class="component-info">
                  <h4>{{ component.name }}</h4>
                  <div class="component-details">
                    <span>Weight: {{ component.weight }}%</span>
                    <span>Max Marks: {{ component.maxMarks }}</span>
                    <span>Students Graded: {{ component.gradedCount }}/{{ getCurrentCourse()?.studentCount }}</span>
                  </div>
                </div>
                <div class="component-actions">
                  <button class="btn-secondary" @click="editComponent(component)">
                    Edit
                  </button>
                  <button class="btn-danger" @click="deleteComponent(component.id)">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Gradebook -->
          <div v-if="activeManagementTab === 'gradebook'" class="gradebook-section">
            <div class="section-header">
              <h3>Gradebook</h3>
              <div class="gradebook-actions">
                <button class="btn-secondary" @click="exportGradebook">
                  📊 Export CSV
                </button>
                <button class="btn-primary" @click="showBulkGradeModal = true">
                  📝 Bulk Grade Entry
                </button>
              </div>
            </div>

            <div class="gradebook-table">
              <table class="grades-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Matric No.</th>
                    <th v-for="component in getCurrentCourse()?.components" :key="component.id">
                      {{ component.name }}
                      <br><small>({{ component.weight }}%)</small>
                    </th>
                    <th>Final Exam (30%)</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in getCurrentCourse()?.students" :key="student.id">
                    <td class="student-name">{{ student.name }}</td>
                    <td>{{ student.matricNo }}</td>
                    <td v-for="component in getCurrentCourse()?.components" :key="component.id">
                      <input 
                        type="number" 
                        :max="component.maxMarks"
                        v-model="student.grades[component.id]"
                        @input="calculateTotal(student)"
                        class="grade-input"
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        max="30"
                        v-model="student.finalExam"
                        @input="calculateTotal(student)"
                        class="grade-input"
                      />
                    </td>
                    <td class="total-marks">{{ student.total || 0 }}</td>
                    <td class="grade-cell" :class="getGradeClass(student.grade)">
                      {{ student.grade || 'N/A' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Course Settings -->
          <div v-if="activeManagementTab === 'settings'" class="settings-section">
            <div class="section-header">
              <h3>Course Settings</h3>
              <button class="btn-primary" @click="saveCourseSettings">
                Save Changes
              </button>
            </div>

            <div class="settings-form">
              <div class="form-group">
                <label>Course Name</label>
                <input v-model="courseSettings.name" type="text" class="input-field" />
              </div>
              
              <div class="form-group">
                <label>Course Code</label>
                <input v-model="courseSettings.code" type="text" class="input-field" />
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="courseSettings.description" class="input-field" rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label>Semester</label>
                <select v-model="courseSettings.semester" class="input-field">
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Credit Hours</label>
                <input v-model="courseSettings.credits" type="number" class="input-field" min="1" max="6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Component Modal -->
    <div v-if="showAddComponentModal" class="modal-overlay" @click="showAddComponentModal = false">
      <div class="modal-content" @click.stop>
        <h3>Add Assessment Component</h3>
        <form @submit.prevent="addComponent">
          <div class="form-group">
            <label>Component Name</label>
            <input v-model="newComponent.name" type="text" class="input-field" required />
          </div>
          <div class="form-group">
            <label>Weight (%)</label>
            <input v-model="newComponent.weight" type="number" class="input-field" min="1" max="100" required />
          </div>
          <div class="form-group">
            <label>Maximum Marks</label>
            <input v-model="newComponent.maxMarks" type="number" class="input-field" min="1" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showAddComponentModal = false">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Add Component
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
  { path: '/lecturer/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/lecturer/courses', label: 'Course Management', icon: '📚' },
  { path: '/lecturer/analytics', label: 'Analytics', icon: '📊' },
  { path: '/lecturer/notifications', label: 'Notifications', icon: '🔔' }
]

const selectedCourse = ref(1)
const activeManagementTab = ref('components')
const showAddComponentModal = ref(false)
const showBulkGradeModal = ref(false)

const managementTabs = [
  { id: 'components', label: 'Assessment Components' },
  { id: 'gradebook', label: 'Gradebook' },
  { id: 'settings', label: 'Course Settings' }
]

const newComponent = ref({
  name: '',
  weight: '',
  maxMarks: ''
})

const courseSettings = ref({
  name: 'Data Structures & Algorithms',
  code: 'CS201',
  description: 'Introduction to fundamental data structures and algorithms',
  semester: 'Fall 2024',
  credits: 3
})

const courses = ref([
  {
    id: 1,
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    studentCount: 45,
    components: [
      { id: 1, name: 'Quiz 1', weight: 10, maxMarks: 20, gradedCount: 45 },
      { id: 2, name: 'Assignment 1', weight: 15, maxMarks: 15, gradedCount: 43 },
      { id: 3, name: 'Mid-term Exam', weight: 25, maxMarks: 25, gradedCount: 45 }
    ],
    students: [
      { 
        id: 1, 
        name: 'John Doe', 
        matricNo: 'A12345', 
        grades: { 1: 18, 2: 14, 3: 22 }, 
        finalExam: 25, 
        total: 79, 
        grade: 'B+' 
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        matricNo: 'A12346', 
        grades: { 1: 20, 2: 15, 3: 24 }, 
        finalExam: 28, 
        total: 87, 
        grade: 'A-' 
      },
      { 
        id: 3, 
        name: 'Bob Johnson', 
        matricNo: 'A12347', 
        grades: { 1: 16, 2: 13, 3: 20 }, 
        finalExam: 22, 
        total: 71, 
        grade: 'B' 
      }
    ]
  },
  {
    id: 2,
    name: 'Software Engineering',
    code: 'CS301',
    studentCount: 38,
    components: [
      { id: 4, name: 'Project Phase 1', weight: 20, maxMarks: 20, gradedCount: 38 },
      { id: 5, name: 'Quiz 1', weight: 10, maxMarks: 10, gradedCount: 38 }
    ],
    students: [
      { 
        id: 4, 
        name: 'Alice Brown', 
        matricNo: 'A12348', 
        grades: { 4: 18, 5: 9 }, 
        finalExam: 0, 
        total: 0, 
        grade: 'N/A' 
      }
    ]
  }
])

const getCurrentCourse = () => {
  return courses.value.find(course => course.id === selectedCourse.value)
}

const addComponent = () => {
  const course = getCurrentCourse()
  if (course) {
    const component = {
      id: Date.now(),
      name: newComponent.value.name,
      weight: parseInt(newComponent.value.weight),
      maxMarks: parseInt(newComponent.value.maxMarks),
      gradedCount: 0
    }
    course.components.push(component)
  }

  newComponent.value = { name: '', weight: '', maxMarks: '' }
  showAddComponentModal.value = false
}

const editComponent = (component) => {
  console.log('Edit component:', component)
}

const deleteComponent = (componentId) => {
  const course = getCurrentCourse()
  if (course) {
    course.components = course.components.filter(c => c.id !== componentId)
  }
}

const calculateTotal = (student) => {
  const course = getCurrentCourse()
  if (!course) return

  let total = 0
  let totalWeight = 0

  // Calculate continuous assessment (70%)
  course.components.forEach(component => {
    const grade = student.grades[component.id] || 0
    const percentage = (grade / component.maxMarks) * 100
    total += (percentage * component.weight / 100) * 0.7
    totalWeight += component.weight
  })

  // Add final exam (30%)
  if (student.finalExam) {
    total += (student.finalExam / 30) * 30
  }

  student.total = Math.round(total)
  student.grade = calculateGrade(student.total)
}

const calculateGrade = (total) => {
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
}

const getGradeClass = (grade) => {
  if (['A+', 'A', 'A-'].includes(grade)) return 'grade-excellent'
  if (['B+', 'B', 'B-'].includes(grade)) return 'grade-good'
  if (['C+', 'C', 'C-'].includes(grade)) return 'grade-average'
  return 'grade-poor'
}

const exportGradebook = () => {
  const course = getCurrentCourse()
  if (!course) return

  // Create CSV content
  let csvContent = 'Student Name,Matric No,'
  course.components.forEach(comp => {
    csvContent += `${comp.name},`
  })
  csvContent += 'Final Exam,Total,Grade\n'

  course.students.forEach(student => {
    csvContent += `${student.name},${student.matricNo},`
    course.components.forEach(comp => {
      csvContent += `${student.grades[comp.id] || 0},`
    })
    csvContent += `${student.finalExam || 0},${student.total || 0},${student.grade || 'N/A'}\n`
  })

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${course.name}_gradebook.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const saveCourseSettings = () => {
  const course = getCurrentCourse()
  if (course) {
    course.name = courseSettings.value.name
    course.code = courseSettings.value.code
  }
  alert('Course settings saved successfully!')
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

.courses-content {
  padding: 32px;
}

.course-selector {
  margin-bottom: 24px;
}

.course-management {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.management-tabs {
  display: flex;
  border-bottom: 1px solid #E5E7EB;
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--warm-gray);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: var(--royal-blue);
  border-bottom-color: var(--royal-blue);
}

.components-section, .gradebook-section, .settings-section {
  padding: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  color: var(--dark-charcoal);
}

.gradebook-actions {
  display: flex;
  gap: 12px;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.component-card {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-info h4 {
  margin-bottom: 8px;
  color: var(--dark-charcoal);
}

.component-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--warm-gray);
}

.component-actions {
  display: flex;
  gap: 8px;
}

.gradebook-table {
  overflow-x: auto;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.grades-table th,
.grades-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.grades-table th {
  background: #F9FAFB;
  font-weight: 600;
  color: var(--dark-charcoal);
}

.student-name {
  font-weight: 600;
  color: var(--dark-charcoal);
}

.grade-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  text-align: center;
}

.grade-input:focus {
  outline: none;
  border-color: var(--royal-blue);
}

.total-marks {
  font-weight: 700;
  color: var(--dark-charcoal);
}

.grade-cell {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
}

.grade-excellent {
  background: #DCFCE7;
  color: var(--emerald-green);
}

.grade-good {
  background: #EBF4FF;
  color: var(--royal-blue);
}

.grade-average {
  background: #FEF3C7;
  color: #D97706;
}

.grade-poor {
  background: #FEE2E2;
  color: var(--crimson-red);
}

.settings-form {
  max-width: 600px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .component-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .grades-table {
    font-size: 12px;
  }
  
  .grades-table th,
  .grades-table td {
    padding: 8px 4px;
  }
}
</style>