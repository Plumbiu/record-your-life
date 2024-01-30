<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'

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
    <div class="key">{{ app }}</div>
  </div>
</template>

<style scoped>
.app_item {
  display: flex;
  align-items: center;
  border-radius: 2px;
  gap: 8px;
  padding: 8px 4px;
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
  background-color: var(--active-color);
}
</style>
