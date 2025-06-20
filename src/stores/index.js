import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    userRole: null,
    isAuthenticated: false,
    students: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@student.com',
        courses: ['Mathematics', 'Physics', 'Chemistry'],
        marks: {
          Mathematics: 85,
          Physics: 78,
          Chemistry: 92
        },
        feedback: [
          { course: 'Mathematics', message: 'Excellent problem-solving skills', date: '2024-01-15' },
          { course: 'Physics', message: 'Good understanding of concepts', date: '2024-01-20' }
        ]
      }
    ],
    lecturers: [
      {
        id: 1,
        name: 'Dr. Smith',
        email: 'smith@lecturer.com',
        courses: ['Mathematics', 'Advanced Calculus'],
        students: [
          { id: 1, name: 'John Doe', progress: 85 },
          { id: 2, name: 'Jane Smith', progress: 92 }
        ]
      }
    ],
    courses: [
      {
        id: 1,
        name: 'Mathematics',
        lecturer: 'Dr. Smith',
        students: 25,
        description: 'Basic mathematics course covering algebra and geometry'
      },
      {
        id: 2,
        name: 'Physics',
        lecturer: 'Dr. Johnson',
        students: 30,
        description: 'Introduction to physics principles and applications'
      }
    ]
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    SET_USER_ROLE(state, role) {
      state.userRole = role
    },
    LOGOUT(state) {
      state.user = null
      state.userRole = null
      state.isAuthenticated = false
    },
    ADD_FEEDBACK(state, feedback) {
      const student = state.students.find(s => s.id === feedback.studentId)
      if (student) {
        student.feedback.push(feedback)
      }
    },
    UPDATE_MARKS(state, { studentId, course, mark }) {
      const student = state.students.find(s => s.id === studentId)
      if (student) {
        student.marks[course] = mark
      }
    }
  },
  actions: {
    login({ commit }, { email, password, role }) {
      return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
          let user = null
          
          if (role === 'student') {
            user = this.state.students.find(s => s.email === email)
          } else if (role === 'lecturer') {
            user = this.state.lecturers.find(l => l.email === email)
          }
          
          if (user && password === 'password') {
            commit('SET_USER', user)
            commit('SET_USER_ROLE', role)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('userRole', role)
            resolve(user)
          } else {
            reject(new Error('Invalid credentials'))
          }
        }, 1000)
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
    },
    addFeedback({ commit }, feedback) {
      commit('ADD_FEEDBACK', feedback)
    },
    updateMarks({ commit }, payload) {
      commit('UPDATE_MARKS', payload)
    }
  },
  getters: {
    getCurrentUser: state => state.user,
    getUserRole: state => state.userRole,
    isAuthenticated: state => state.isAuthenticated,
    getStudentCourses: state => {
      if (state.user && state.userRole === 'student') {
        return state.user.courses
      }
      return []
    },
    getStudentMarks: state => {
      if (state.user && state.userRole === 'student') {
        return state.user.marks
      }
      return {}
    },
    getStudentFeedback: state => {
      if (state.user && state.userRole === 'student') {
        return state.user.feedback
      }
      return []
    }
  }
})