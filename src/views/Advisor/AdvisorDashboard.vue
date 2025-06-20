<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
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
</template>

<script setup>
import { ref } from 'vue';

const advisorData = ref({
  advisees: [
    { id: 101, name: 'David Lee', matricNo: 'S9876543D', gpa: 3.5, atRisk: false },
    { id: 102, name: 'Eve White', matricNo: 'S9876543E', gpa: 1.8, atRisk: true },
    { id: 103, name: 'Frank Green', matricNo: 'S9876543F', gpa: 2.9, atRisk: false },
  ],
});

const newMeeting = ref({
  studentId: '',
  notes: '',
});
const meetingMessage = ref('');

const addMeetingRecord = () => {
  if (newMeeting.value.studentId && newMeeting.value.notes) {
    const studentName = advisorData.value.advisees.find(a => a.id === newMeeting.value.studentId)?.name;
    meetingMessage.value = `Meeting record for ${studentName} added successfully!`;
    console.log("Adding meeting record:", newMeeting.value);
    // In a real app, send this to backend
    newMeeting.value = { studentId: '', notes: '' };
  } else {
    meetingMessage.value = 'Please select a student and add notes.';
  }
};

const viewAdvisee = (adviseeId) => {
  console.log(`Viewing advisee with ID: ${adviseeId}`);
  // In a real app, navigate to advisee profile page
};
</script>
