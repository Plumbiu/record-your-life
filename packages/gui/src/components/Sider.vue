<script setup lang="ts">
import { Button } from 'ant-design-vue'
import {
  BorderlessTableOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue'
</script>

<template>
  <div class="sider">
    <div class="sider-item">
      <Button>
        <template #icon>
          <BorderlessTableOutlined />
        </template>
        表格
      </Button>
    </div>
    <div class="sider-item">
      <Button>
        <template #icon>
          <BarChartOutlined />
        </template>
        图表
      </Button>
    </div>
  </div>
</template>

<style scoped>
.sider {
  margin: 0 6px;
}

.sider-item {
  margin-bottom: 6px;
}
</style>
