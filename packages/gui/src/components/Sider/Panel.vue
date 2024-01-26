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
        <div class="num">{{ bl }}</div>
      </div>
      <div class="f-c" style="width: 125px">
        <span class="fade">{{ br }} YTD</span>
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
.num {
  font-weight: 700;
  font-size: 18px;
}
.fade {
  color: #777;
}
</style>
