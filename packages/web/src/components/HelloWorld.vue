<script setup lang="ts">
import VChart from '../chart/index'
import { onMounted } from 'vue'
import { formatAreaChartData } from '../utils/chart/index'

const data = await fetch(
  import.meta.env.PROD ? '/api/data' : '/test.json',
).then((res) => res.json())

function createChart(type: string, dom: string, isHorizontal = false) {
  const chart = new VChart(formatAreaChartData(data, type, isHorizontal), {
    dom,
  })
  chart.on('legendItemHover', (e) => {
    const hoveredName = e?.value?.data?.label
    if (hoveredName) {
      chart.updateState({
        legend_hover_reverse: {
          filter: (d) => d.type !== hoveredName,
        },
      })
    }
  })
  chart.on('legendItemUnHover', () => {
    chart.updateState({
      legend_hover_reverse: {
        filter: () => false,
      },
    })
  })
  chart.renderAsync()
}

onMounted(() => {
  createChart('bar', 'bar_chart')
  createChart('area', 'area_chart')
  createChart('bar', 'bar_chart_h', true)
  createChart('area', 'area_chart_h', true)
})
</script>

<template>
  <div class="chart" style="display: flex">
    <div id="bar_chart" />
    <div id="area_chart" />
    <div id="bar_chart_h" />
    <div id="area_chart_h" />
  </div>
</template>

<style scoped>
.chart {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100vh;
}
#bar_chart,
#area_chart,
#bar_chart_h,
#area_chart_h {
  width: 50%;
  height: 50vh;
}
</style>
