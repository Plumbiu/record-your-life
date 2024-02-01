<script setup lang="ts">
import ChartItem from './item.vue'
import { useAppStore } from '@/store'
import Status from './Status.vue'

const appStore = useAppStore()
</script>

<template>
  <div>
    <Status />
    <div class="chart">
      <ChartItem :key="appStore.activeAppName" />
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
