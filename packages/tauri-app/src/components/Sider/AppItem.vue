<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
import Tag from '@/components/ui/Tag.vue'
import { formatDuration } from '@record-your-life/shared'

const { total, isActive, icon, app } = defineProps<{
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
    <div>
      <div class="key">{{ app }}</div>
      <Tag>{{ formatDuration(total) }}</Tag>
    </div>
  </div>
</template>

<style scoped>
.app_item {
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 8px 6px;
  gap: 8px;
  width: var(--sider);
  cursor: pointer;
  transition: background-color 125ms;
}
.key {
  font-size: 12px;
}
.app_item:hover {
  background-color: var(--active-color);
}
.active {
  position: relative;
}
.active::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background-color: red;
  border-radius: 0 2px 2px 0;
}
</style>
