<script setup lang="ts">
import CustomNavbar from './componets/CustomNavbar.vue'
import CategoryPanel from './componets/CategoryPanel.vue'
import HotPanel from './componets/HotPanel.vue'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import type { XtxGuessInstance } from '@/types/components'
import PageSkeleton from './componets/PageSkeleton.vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAllBanners } from '@/services/services'
import type Api from '@/types'

const homeBannerList = ref<Api.Schema.BannerVO[]>()
const categoryList = ref<CategoryItem[]>()
const homeHotList = ref<HotItem[]>()

//骨架屏
const isLoading = ref(false)

//猜你喜欢部分:
const guessRef = ref<XtxGuessInstance>()
const onScrolltoLower = () => {
  //当滑动到底部时，调用子组件的方法
  guessRef.value?.getMore()
}
//下拉刷新
const isTriggered = ref(false)
const onRefresherRefresh = async () => {
  isTriggered.value = true

  guessRef.value?.resetData()
  await Promise.all([getHomeBannerAPI(), getHomeCategoryAPI(), getHomeHotAPI()])
  isTriggered.value = false
  uni.showToast({
    title: '刷新成功',
    icon: 'success',
  })
}
const getBannerData = async () => {
  const bannerRes = await getAllBanners()
  homeBannerList.value = bannerRes
}

const getCategoryData = async () => {
  const categoryRes = await getHomeCategoryAPI()
  categoryList.value = categoryRes.result
}

const getHotData = async () => {
  const hotRes = await getHomeHotAPI()
  homeHotList.value = hotRes.result
}

const getAllList = async () => {
  isLoading.value = true
  try {
    await getBannerData()
    await getCategoryData()
    await getHotData()
  } catch (error) {
    console.error('Error fetching home data:', error)
  }
  isLoading.value = false
}

onLoad(() => {
  getAllList()
})
</script>

<template>
  <view class="index">
    <scroll-view
      class="scroll-view"
      scroll-y
      refresher-enabled
      @refresherrefresh="onRefresherRefresh"
      :refresher-triggered="isTriggered"
    >
      <PageSkeleton v-if="isLoading"></PageSkeleton>
      <template v-else>
        <view>
          <CustomNavbar></CustomNavbar>
          <XtxSwiper :list="homeBannerList"></XtxSwiper>
          <CategoryPanel v-if="categoryList" :list="categoryList"></CategoryPanel>
          <HotPanel v-if="homeHotList" :list="homeHotList"></HotPanel>
          <scroll-view scroll-y @scrolltolower="onScrolltoLower">
            <XtxGuess ref="guessRef"></XtxGuess>
          </scroll-view>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<style lang="scss">
.index {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}
.scroll-view {
  flex: 1;
  background-color: #f5f5f5;
  padding-bottom: 20rpx;
}
</style>
