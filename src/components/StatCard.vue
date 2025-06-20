<template>
  <div class="stat-card" :class="cardClass">
    <h3>{{ title }}</h3>
    <div class="stat-value" :class="valueClass">{{ value }}</div>
    <p class="stat-change" :class="changeClass">{{ change }}</p>
    <div v-if="showProgress" class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Dummy Data
const props = {
  title: 'User Activity',
  value: 1350,
  change: '+150',
  changeType: 'positive',
  valueType: 'primary',
  cardType: 'default',
  showProgress: true,
  progressPercent: 75
}

const cardClass = computed(() => {
  return {
    'at-risk': props.cardType === 'at-risk'
  }
})

const valueClass = computed(() => {
  return {
    'text-primary': props.valueType === 'primary',
    'text-secondary': props.valueType === 'secondary',
    'text-danger': props.valueType === 'danger'
  }
})

const changeClass = computed(() => {
  return {
    'positive': props.changeType === 'positive',
    'negative': props.changeType === 'negative'
  }
})
</script>

<style scoped>
.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.at-risk {
  border-left: 4px solid var(--crimson-red);
}

.stat-card h3 {
  color: var(--warm-gray);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 14px;
  color: var(--warm-gray);
}

.stat-change.positive {
  color: var(--emerald-green);
}

.stat-change.negative {
  color: var(--crimson-red);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--emerald-green);
  transition: width 0.3s ease;
}
</style>