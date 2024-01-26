<script setup lang="ts">
const { app, total, isActive, icon } = defineProps<{
  app: string
  isActive: boolean
  total: string
  icon: string
}>()
</script>

<template>
  <div
    class="app_item"
    :class="{
      active: isActive,
    }"
  >
    <div class="icon">
      <img :src="icon" />
    </div>
    <div>
      <div class="key">{{ app }}</div>
      <div class="value">{{ total }}h</div>
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
.key,
.value {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.value {
  font-size: 12px;
  color: #777;
}
.active {
  background-color: #333;
}
</style>
