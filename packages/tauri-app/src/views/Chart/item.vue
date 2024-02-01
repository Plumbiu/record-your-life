<script setup lang="ts">
import { Chart, CHART_OPTIONS } from '@/plugins/chart'
import { useAppStore } from '@/store'
import { randomColor, uniqueArray } from '@/utils'
import { getHMS, uniqueDurationByHour } from '@record-your-life/shared'
import { computed, onMounted } from 'vue'

const store = useAppStore()
const data = computed(() => {
  try {
    return uniqueDurationByHour(store.activeApp?.durations ?? []) ?? []
  } catch (error) {
    return []
  }
})

function createColor(elm: HTMLCanvasElement) {
  const color = randomColor()
  const ctx = elm.getContext('2d')
  const gradient = ctx?.createLinearGradient(0, 0, 0, 400)
  gradient?.addColorStop(0, color + 'aa')
  gradient?.addColorStop(0.75, color + '10')
  return gradient
}

function canCrateChart() {
  if (data.value.length === 0) {
    return false
  }
  return true
}

onMounted(() => {
  if (!canCrateChart()) {
    return
  }
  const elm = document.getElementById('canvas') as HTMLCanvasElement
  if (elm) {
    const color = createColor(elm)
    new Chart(elm, {
      type: 'line',
      ...CHART_OPTIONS,
      data: {
        labels: uniqueArray(
          data.value.map((row) => getHMS(row.time).slice(0, -3)),
        ),
        datasets: [
          {
            borderColor: color,
            data: data.value.map((row) => row.duration),
            fill: true,
            backgroundColor: color,
            borderWidth: 4,
          },
        ],
      },
    })
  }
})
</script>

<template>
  <div class="canvas_container">
    <canvas id="canvas" />
  </div>
</template>

<style scoped>
.canvas_container {
  flex: 1;
  border-radius: 4px;
}
</style>
