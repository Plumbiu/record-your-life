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
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 300px;
  right: 0;
  display: flex;
  border-bottom: 1px solid #282828;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #181818;
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
