<script setup lang="ts">
import { ref } from 'vue'
import XtxSearchBar from './componets/XtxSearchBar.vue'
import XtxBanner from './componets/XtxBanner.vue'
import XtxCategories from './componets/XtxCategories.vue'
import CustomNavbar from './componets/CustomNavbar.vue'
import HotGoodsList from './componets/HotGoodsList.vue'

// 模拟下拉刷新
const isRefreshing = ref(false)
const onRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    uni.showToast({ title: '刷新成功' })
  }, 1000)
}

// 模拟上拉加载
const isLoading = ref(false)
const onLoadMore = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}
</script>

<template>
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <CustomNavbar />
    <!-- 轮播图 -->
    <XtxBanner />

    <!-- 分类导航 -->
    <XtxCategories />

    <!-- 商品列表 -->
    <!-- <XtxGoodsList
      @refresh="onRefresh"
      @load-more="onLoadMore"
      :refreshing="isRefreshing"
      :loading="isLoading"
    /> -->

    <HotGoodsList />
  </view>
</template>

<style lang="scss">
.viewport {
  padding-bottom: 20rpx;
  background-color: #f7f7f7;
  min-height: 100vh;
}
</style>
