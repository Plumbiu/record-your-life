<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
import { formatDuration } from '@record-your-life/shared'

const { app, total, isActive, icon } = defineProps<{
  app: string
  isActive: boolean
  total: number | undefined
  icon: string
}>()
</script>

<template>
  <div
    v-if="total"
    class="app_item"
    :class="{
      active: isActive,
    }"
  >
    <Avatar :src="icon" />
    <div class="info">
      <div class="key">{{ app }}</div>
      <div class="value">{{ formatDuration(total) }}</div>
    </div>
  </div>
</template>

<style scoped>
.app_item {
  display: flex;
  align-items: center;
  border-radius: 4px;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  transition: background-color 125ms;
}

.info {
  font-size: 14px;
}
.value {
  color: #777;
  font-size: 12px;
}
.app_item:hover {
  background-color: #333;
}
.active {
  background-color: #333;
}
</style>
