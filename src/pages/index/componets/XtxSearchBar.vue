<script setup lang="ts">
const gotoSearch = () => {
  uni.navigateTo({
    url: '/pages-sub/search/index',
  })
}
</script>

<template>
  <view class="search-bar" @click="gotoSearch">
    <uni-icons class="search-icon" type="search" size="18" color="#999" />
    <text class="search-text">搜索教材、电子产品...</text>
  </view>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

  .search-icon {
    margin-right: 10rpx;
  }

  .search-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
