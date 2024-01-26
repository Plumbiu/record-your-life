<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'

const { app, total, isActive, icon } = defineProps<{
  app: string
  isActive: boolean
  total: string | undefined
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
  border-radius: 4px;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  transition: background-color 125ms;
}
.icon {
  width: 24px;
  height: 24px;
  padding: 4px;
}
.icon img {
  width: 100%;
}
.app_item:hover {
  background-color: #333;
}
.active {
  background-color: #333;
}
</style>
