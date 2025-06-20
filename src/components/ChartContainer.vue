<!-- File: src/components/ChartContainer.vue -->
<template>
  <div class="bg-white rounded-lg p-4 shadow">
    <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
    <slot name="chart" />
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>

<style scoped></style>
