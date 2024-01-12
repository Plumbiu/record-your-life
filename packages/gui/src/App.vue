<script setup lang="ts">
import AppTable from './components/AppTable.vue'
import { ConfigProvider, theme } from 'ant-design-vue'
import Header from './components/Header.vue'
import Sider from './components/Sider.vue'
</script>

<template>
  <ConfigProvider
    :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
    <Suspense>
      <div class="container">
        <Header />
        <div class="main">
          <Sider />
          <AppTable />
        </div>
      </div>
    </Suspense>
  </ConfigProvider>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 50px);
}
</style>
