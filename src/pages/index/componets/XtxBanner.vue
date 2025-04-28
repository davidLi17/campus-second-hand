<script setup lang="ts">
import { ref } from 'vue'
// 假数据
const bannerList = ref([
  {
    id: 1,
    imgUrl:
      'https://bpic.588ku.com/element_origin_min_pic/23/07/11/d32dabe266d10da8b21bd640a2e9b611.jpg!r650',
    hrefUrl: '',
  },
  {
    id: 2,
    imgUrl: 'https://pic1.zhimg.com/v2-a58fa2ab84be291418da2652805f8270_b.jpg',
    hrefUrl: '',
  },
  {
    id: 3,
    imgUrl: 'https://cdn.example.com/banner3.jpg',
    hrefUrl: '',
  },
])
</script>

<template>
  <swiper class="banner" :autoplay="true" :interval="3000" :circular="true">
    <swiper-item v-for="item in bannerList" :key="item.id">
      <image class="banner-image" :src="item.imgUrl" mode="aspectFill" />
    </swiper-item>
  </swiper>
</template>

<style lang="scss" scoped>
.banner {
  height: 340rpx;
  margin: 0 30rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .banner-image {
    width: 100%;
    height: 100%;
  }
}
</style>
