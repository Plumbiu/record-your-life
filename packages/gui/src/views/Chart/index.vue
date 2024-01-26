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
        :name="appStore.activeAppName"
        :total="formatDuration(appStore.activeApp.total)"
        :data="appStore.activeApp.durations ?? []"
      />
    </div>
  </div>
</template>

<style scoped>
.chart {
  width: 90%;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: flex-start;
  margin: 0 auto;
  flex-wrap: wrap;
}

.multi_chart {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;

  flex-wrap: wrap;
}
.multi_chart > div {
  width: 50%;
}
</style>
