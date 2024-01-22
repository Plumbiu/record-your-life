<script setup lang="ts">
const { tl, bl, br } = defineProps<{
  tl: string | number
  bl: string | number
  br: string | number
}>()
</script>

<template>
  <div class="panel">
    <div class="panel_item">
      <div class="fade">{{ tl }}</div>
      <slot name="tr" />
    </div>
    <div class="panel_item">
      <div>
        <h2>{{ bl }}</h2>
      </div>
      <div class="f-c" style="width: 130px">
        <span class="fade">{{ br }}</span>
        <slot name="br" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  margin: 8px;
  border-radius: 2px;
  width: 92%;
  background-color: #222;
  box-sizing: border-box;
  padding: 12px;
}
.panel_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fade {
  color: #777;
}
</style>
