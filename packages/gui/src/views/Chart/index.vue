<script setup lang="ts">
import ChartItem from '@/components/Chart/item.vue'
import Panel from '@/components/Panel/index.vue'
import { formatDuration } from '@record-your-life/shared'
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<template>
  <div class="chart_wrapper">
    <Panel />
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
  display: flex;
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: space-between;
  margin: 0 auto;
}
</style>
