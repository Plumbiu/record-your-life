<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div class="header">
    <div>Logo</div>
    <div class="right">
      <GithubOutlined />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  align-items: center;
  height: 50px;
}
.right {
  font-size: 20px;
  color: #dee;
}
</style>
