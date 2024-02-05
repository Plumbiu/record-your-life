<script setup lang="ts">
import { Chart } from '@/plugins/chart'
import { useAppStore } from '@/store'
import { randomColor } from '@/utils'
import { formatDuration, getHMS } from '@record-your-life/shared'
import { onMounted } from 'vue'

const store = useAppStore()
const data = store.activeApp?.durations ?? []

function createColor(elm: HTMLCanvasElement) {
  const color = randomColor()
  const ctx = elm.getContext('2d')
  const gradient = ctx?.createLinearGradient(0, 0, 0, 400)
  gradient?.addColorStop(0, color)
  gradient?.addColorStop(1, color + '22')
  return gradient
}

function setupChart() {
  if (data.length === 0) {
    return
  }
  const elm = document.getElementById('canvas') as HTMLCanvasElement
  if (!elm) {
    return
  }
  console.log(formatDuration(data[data.length - 1].duration, 1))
  const color = createColor(elm)
  new Chart(elm, {
    type: 'line',
    options: {
      scales: {
        y: {
          max: data[data.length - 1].duration * 1.15,
          ticks: {
            callback(value: any) {
              if (typeof value === 'string') {
                return value
              }
              return formatDuration(value, 1)
            },
          },
        },
      },
    },
    data: {
      labels: data.map((row) => getHMS(row.time).slice(0, -3)),
      datasets: [
        {
          borderColor: color,
          data: data.map((row) => row.duration),
          fill: true,
          backgroundColor: color,
          borderWidth: 2,
          tension: 0.25
        },
      ],
    },
  })
}

onMounted(() => {
  setupChart()
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
