<script lang="ts" setup>
import { NTable } from 'naive-ui'
import { useAppStore } from '@/store'
import { formatDuration, getHMS } from '@record-your-life/shared'
import Avatar from '@/components/ui/Avatar.vue'

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
      <th>Start</th>
      <th>Total</th>
    </thead>
    <tbody>
      <tr v-for="item in store.usage" :key="item.name">
        <td style="display: flex; align-items: center; gap: 4px">
          <Avatar :src="item.icon" />
          <span>
            {{ item.name }}
          </span>
        </td>
        <td>{{ getHMS(item.start) }}</td>
        <td>{{ formatDuration(item.total) }}</td>
      </tr>
    </tbody>
  </NTable>
</template>
