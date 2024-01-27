<script setup lang="ts">
import ChartItem from './item.vue'
import { formatDuration } from '@record-your-life/shared'
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<template>
  <div class="chart_wrapper">
    <div class="chart" v-if="appStore.activeApp">
      <ChartItem
        :key="appStore.activeAppName"
        :total="formatDuration(appStore.activeApp.total)"
        :data="appStore.activeApp.durations ?? []"
      />
    </div>
  </div>
</template>

<style scoped>
.chart {
  border: var(--border);
  display: flex;
  border-radius: 4px;
  padding: 4px;
  justify-content: space-between;
  margin: 0 auto;
}
</style>
