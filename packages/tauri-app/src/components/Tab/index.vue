<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import LineChartIcon from '@/components/icons/LineChart.vue'
import TableIcon from '@/components/icons/Table.vue'
import Table from '@/views/Table/index.vue'
import Chart from '@/views/Chart/index.vue'
</script>

<template>
  <div class="tab">
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
    </NTabs>
  </div>
</template>

<style scoped>
.tab {
  margin: 0 6px;
}
span {
  margin-left: 6px;
}
</style>
