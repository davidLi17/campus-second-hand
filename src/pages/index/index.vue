<script setup lang="ts">
import { CustomNavbar } from './componets/CustomNavbar.vue'
import { CategoryPanel } from './componets/CategoryPanel.vue'
</script>

<template>
  <view class="index">
    <view>
      <CustomNavbar></CustomNavbar>
      <XtxSwiper></XtxSwiper>
      <CategoryPanel></CategoryPanel>
    </view>
  </view>
</template>

<style lang="scss">
//
</style>
