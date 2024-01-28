<script setup lang="ts">
import DataIcon from '@/components/icons/Data.vue'
import SettingIcon from '@/components/icons/Setting.vue'
import SponsorIcon from '@/components/icons/Sponsor.vue'
import SubSider from './SubSider.vue'
</script>

<template>
  <div class="sider">
    <div class="sider_item">
      <div class="side_item__active">
        <DataIcon />
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
  <SubSider />
</template>

<style scoped>
.sider {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  border-right: var(--sider-border);
  flex-direction: column;
  justify-content: space-between;
  width: var(--sider-base);
  background-color: #181818;
  text-align: center;
}
.sider_item > div {
  cursor: pointer;
  text-align: center;
  transition: background-color 125ms;
  border-radius: 4px;
  padding: 8px 0;
  width: var(--sider-base);
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
