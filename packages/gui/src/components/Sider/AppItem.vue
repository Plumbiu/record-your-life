<script setup lang="ts">
const { app, isActive, total } = defineProps<{
  app: string
  isActive: boolean
  total: string
}>()
</script>

<template>
  <RouterLink
    :to="{
      name: 'chart',
      path: '/chart',
      query: {
        app,
      },
    }"
    :class="{
      side_item__active: isActive,
    }"
  >
    <div>{{ app }}</div>
    <div class="value">
      <span>use</span>
      <span>-</span>
      <span>{{ total }}h</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.value {
  display: flex;
  align-items: center;
  color: #777;
  gap: 4px;
}
.side_item__active {
  position: relative;
}
.side_item__active::before {
  content: '';
  position: absolute;
  left: -12px;
  top: -3px;
  bottom: -3px;
  background-color: red;
  border-radius: 0 2px 2px 0;
  width: 4px;
}
</style>
