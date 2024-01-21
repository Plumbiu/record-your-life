<script setup lang="ts">
import DataIcon from '@/components/icons/Data.vue'
import TableIcon from '@/components/icons/Table.vue'
import SettingIcon from '@/components/icons/Setting.vue'
import SponsorIcon from '@/components/icons/Sponsor.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const query = route.query.type
</script>

<template>
  <div class="sider">
    <div class="sider_item">
      <div class="side_item__active">
        <DataIcon />
      </div>
      <div>
        <TableIcon />
      </div>
    </div>
    <div class="sider_item">
      <div>
        <SettingIcon />
      </div>
      <div class="sponsor">
        <SponsorIcon />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sider {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  border-right: 1px solid #333;
  flex-direction: column;
  justify-content: space-between;
  width: 60px;
  background-color: #222;
  text-align: center;
}
.sider_item > div {
  cursor: pointer;
  transition: background-color 125ms;
  border-radius: 4px;
  padding: 10px 0;
  width: 60px;
}

.sider_item > div:hover {
  background-color: #444;
}

.side_item__active {
  position: relative;
  color: red;
}
.side_item__active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: red;
  border-radius: 0 4px 4px 0;
  width: 4px;
}

.sponsor {
  position: relative;
}
</style>
