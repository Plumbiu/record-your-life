<script lang="ts" setup>
import { NTable } from 'naive-ui'
import { useAppStore } from '@/store'
import { formatDuration, getHMS } from '@record-your-life/shared'

const store = useAppStore()
</script>

<template>
  <NTable
    :bordered="false"
    striped
    style="--n-th-color: #303030; --n-td-cooor: #191919"
  >
    <thead>
      <th>Name</th>
      <th>Time</th>
      <th>Start</th>
      <th>Total</th>
    </thead>
    <tbody>
      <tr v-for="item in store.usage" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ getHMS(item.start) }}</td>
        <td>{{ item.start }}</td>
        <td>{{ formatDuration(item.total) }}</td>
      </tr>
    </tbody>
  </NTable>
</template>
