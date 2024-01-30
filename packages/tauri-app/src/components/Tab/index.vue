<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import LineChartIcon from '@/components/icons/LineChart.vue'
import TableIcon from '@/components/icons/Table.vue'
import JSONIcon from '@/components/icons/JSON.vue'
import TerminalIcon from '@/components/icons/Terminal.vue'
import Chart from '@/views/Chart/index.vue'
import Table from '@/views/Table/index.vue'
import Ternimal from '@/views/Ternimal/index.vue'
</script>

<template>
  <NTabs type="line" animated>
    <NTabPane name="chart">
      <template #tab>
        <LineChartIcon />
        <span>Chart</span>
      </template>
      <Chart />
    </NTabPane>
    <NTabPane name="Table">
      <template #tab>
        <TableIcon />
        <span>Table</span>
      </template>
      <Table />
    </NTabPane>
    <NTabPane name="JSON">
      <template #tab>
        <JSONIcon />
        <span>JSON</span>
      </template>
    </NTabPane>
    <NTabPane name="terminal">
      <template #tab>
        <TerminalIcon />
        <span>Terminal</span>
      </template>
      <Ternimal />
    </NTabPane>
  </NTabs>
</template>

<style scoped>
span {
  margin-left: 6px;
}
</style>
