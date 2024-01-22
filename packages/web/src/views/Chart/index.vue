<script setup lang="ts">
import ChartCmp from '@/components/Chart/index.vue'
import { formatDuration } from '@record-your-life/shared'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const usage = appStore.getCurrentApp()
</script>

<template>
  <div class="chart_wrapper" v-if="usage">
    <ChartCmp
      :name="($route.query.app as string)"
      :total="formatDuration(usage.total)"
      :data="usage.durations ?? []"
    />
  </div>
</template>

<style scoped>
.chart_wrapper {
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: center;
  margin: 0 auto;
  flex-wrap: wrap;
}
</style>
