<script setup lang="ts">
import GithubIcon from '../icons/Github.vue'
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="logo">LOGO</div>
    </div>
    <div class="icons">
      <GithubIcon />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #222;
}
.logo {
  font-weight: 700;
}

.icons,
.left {
  display: flex;
  gap: 12px;
  align-items: center;
}
.left {
  flex: 1;
}
</style>
