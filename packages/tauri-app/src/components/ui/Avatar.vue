<script setup lang="ts">
const { src } = defineProps<{
  src: string | undefined
}>()
</script>

<template>
  <div class="avatar">
    <img :src="src" />
  </div>
</template>

<style scoped>
.avatar {
  width: 24px;
  height: 24px;
  padding: 4px;
}
.avatar img {
  width: 100%;
}
</style>
