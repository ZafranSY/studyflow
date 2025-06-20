<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
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
</template>

<script setup>
import { ref } from 'vue';

// Mock Data
const lecturerData = ref({
  students: [
    { id: 1, name: 'Alice Smith', matricNo: 'S1234567A', overallGrade: 88.5 },
    { id: 2, name: 'Bob Johnson', matricNo: 'S1234567B', overallGrade: 72.1 },
    { id: 3, name: 'Charlie Brown', matricNo: 'S1234567C', overallGrade: 91.0 },
  ],
});

const newAssessment = ref({
  title: '',
  description: '',
  weightage: 0,
  totalMarks: 0,
});
const assessmentMessage = ref('');

const saveAssessment = () => {
  if (newAssessment.value.title && newAssessment.value.weightage > 0 && newAssessment.value.totalMarks > 0) {
    assessmentMessage.value = `Assessment "${newAssessment.value.title}" saved successfully!`;
    console.log("Saving assessment:", newAssessment.value);
    // In a real app, send this to backend and update course data
    newAssessment.value = { title: '', description: '', weightage: 0, totalMarks: 0 };
  } else {
    assessmentMessage.value = 'Please fill all assessment fields correctly.';
  }
};

const viewStudent = (studentId) => {
  console.log(`Viewing/Editing student with ID: ${studentId}`);
  // In a real app, navigate to student profile page
  // router.push({ name: 'StudentProfile', params: { id: studentId } });
};
</script>
