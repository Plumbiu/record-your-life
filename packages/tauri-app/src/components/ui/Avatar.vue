<script setup lang="ts">
import { NIcon } from 'naive-ui'
import ApplicationIcon from '@/components/icons/Application.vue'

const { src } = defineProps<{
  src: string | undefined
}>()
</script>

<template>
  <div class="avatar">
    <img v-if="src" :src="src" />
    <ApplicationIcon v-else />
  </div>
</template>

<style scoped>
.avatar {
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 4px;
}
.avatar img {
  width: 100%;
}

.avatar svg {
  width: 24px;
  height: 24px;
}
</style>
