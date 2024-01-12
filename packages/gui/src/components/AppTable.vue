<script setup lang="ts">
import { computed, ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import {
  Table,
  TableSummaryCell,
  TableSummaryRow,
  TypographyText,
} from 'ant-design-vue'
import { Usage, formatDuration } from '@record-your-life/shared'

interface TableDataType extends Usage {
  name: string
}
const records = ref<TableDataType[]>([])

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
const raw: Record<string, Omit<TableDataType, 'name'>> = JSON.parse(
  await invoke('get_data', { date: '2024-01-11' }),
)
records.value = Object.entries(raw).map(([name, usage]) => ({
  name,
  ...usage,
  key: name,
}))
console.log(raw)

const columns = [
  {
    name: '应用名称',
    dataIndex: '应用名称',
    key: 'name',
  },
  {
    title: '运行时间',
    dataIndex: '运行时间',
    key: 'duration',
    sorter: (a: TableDataType, b: TableDataType) => a.total - b.total,
  },
]
const total = computed(() => {
  return records.value.reduce((prev, cur) => {
    return prev + cur.total
  }, 0)
})
</script>

<template>
  <div class="table">
    <Table :columns="columns" :data-source="records" bordered sticky>
      <template #headerCell="row">
        <template v-if="row?.column.key === 'name'">应用程序</template>
      </template>
      <template #bodyCell="row">
        <template v-if="row?.column.key === 'name'">
          {{ row?.record.name }}
        </template>
        <template v-if="row?.column.key === 'duration'">
          {{ formatDuration(row?.record.total) }}
        </template>
      </template>
      <template #summary>
        <TableSummaryRow>
          <TableSummaryCell>
            <TypographyText type="success">总结</TypographyText>
          </TableSummaryCell>
          <TableSummaryCell>
            <TypographyText type="success">{{ formatDuration(total) }}</TypographyText>
          </TableSummaryCell>
        </TableSummaryRow>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.table {
  border-radius: 0px;
  overflow: hidden;
  flex: 1;
}
</style>
