<script setup lang="ts">
import CustomNavbar from './componets/CustomNavbar.vue'
import CategoryPanel from './componets/CategoryPanel.vue'
import HotPanel from './componets/HotPanel.vue'
import { onMounted, ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
const homeBannerList = ref<BannerItem[]>()
const categoryList = ref<CategoryItem[]>()
const homeHotList = ref<HotItem[]>()
onMounted(() => {
  getHomeBannerAPI()
    .then((res) => {
      homeBannerList.value = res.result
    })
    .catch((error) => {
      console.error('Error fetching home banner:', error)
    })
  getHomeCategoryAPI()
    .then((res) => {
      categoryList.value = res.result
    })
    .catch((error) => {
      console.error('Error fetching home category:', error)
    })
  getHomeHotAPI()
    .then((res) => {
      homeHotList.value = res.result
    })
    .catch((error) => {
      console.error('Error fetching home hot:', error)
    })
})
</script>

<template>
  <view class="index">
    <view>
      <CustomNavbar></CustomNavbar>
      <XtxSwiper :list="homeBannerList"></XtxSwiper>
      <CategoryPanel v-if="categoryList" :list="categoryList"></CategoryPanel>
      <HotPanel v-if="homeHotList" :list="homeHotList"></HotPanel>
    </view>
  </view>
</template>

<style lang="scss">
//
</style>
