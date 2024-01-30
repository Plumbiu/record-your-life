<script setup lang="ts">
import { useAppStore } from '@/store'
const store = useAppStore()
</script>

<template>
  <div>
    {{ store.activeApp?.name }}
  </div>
</template>

<style scoped></style>
