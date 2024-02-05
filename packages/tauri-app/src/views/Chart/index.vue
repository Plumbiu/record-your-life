<script setup lang="ts">
import Panel from './Panel.vue'
import ChartItem from './item.vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<template>
  <Panel />
  <div class="chart">
    <ChartItem :key="appStore.activeAppName" />
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
