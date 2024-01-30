<script setup lang="ts">
import ChartItem from './item.vue'
import { formatDuration } from '@record-your-life/shared'
import { useAppStore } from '@/store'
import Status from './Status.vue'

const appStore = useAppStore()
</script>

<template>
  <div v-if="appStore.activeApp">
    <Status />
    <div class="chart">
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
  display: flex;
  border-radius: 4px;
  padding: 4px;
  justify-content: space-between;
  margin: 0 auto;
}
</style>
