<script setup lang="ts">
const { app, total, isActive } = defineProps<{
  app: string
  isActive: boolean
  total: string
}>()
</script>

<template>
  <div
    class="app_item"
    :class="{
      active: isActive,
    }"
  >
    <div class="key">{{ app }}</div>
    <div class="value">{{ total }}h</div>
  </div>
</template>

<style scoped>
.app_item {
  border-radius: 4px;
  padding: 8px 4px;
  cursor: pointer;
  transition: background-color 125ms;
}
.app_item:hover {
  background-color: #333;
}
.key,
.value {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.value {
  color: #777;
}
.active {
  background-color: #333;
}
</style>
