<script setup lang="ts">
import GithubIcon from '../icons/Github.vue'
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="logo"></div>
    </div>
    <div class="icons">
      <GithubIcon />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: var(--cet-header-h);
  left: var(--sider);
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--bg-cmp);
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
