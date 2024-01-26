<script setup lang="ts">
import ChartItem from '@/components/Chart/item.vue'
import { formatDuration } from '@record-your-life/shared'
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<template>
  <div class="chart_wrapper">
    <div class="chart" v-if="appStore.activeApp">
      <ChartItem
        :key="appStore.activeAppName"
        :name="appStore.activeAppName"
        :total="formatDuration(appStore.activeApp.total)"
        :data="appStore.activeApp.durations ?? []"
      />
    </div>
  </div>
</template>

<style scoped>
.chart {
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: flex-start;
  margin: 0 auto;
  flex-wrap: wrap;
}
</style>
