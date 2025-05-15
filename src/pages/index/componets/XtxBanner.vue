<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getBannerListAPI } from '@/api/banner'

// 轮播图数据
const bannerList = ref<
  Array<{
    id: number
    imgUrl: string
    createTime: string
    updateTime: string
  }>
>([])

// 分页参数
const pagination = ref({
  page: 1,
  pageSize: 5,
  total: 0,
  pages: 0,
})

// 加载状态
const loading = ref(false)
const error = ref(false)

// 获取轮播图数据
const fetchBannerList = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await getBannerListAPI({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    console.log('LHG:componets/XtxBanner.vue  res:::', res)

    // 添加数据校验
    if (!res || !res.data) {
      throw new Error(res.message || 'API返回数据格式不正确')
    }

    // 确保items存在，如果不存在则设为空数组
    bannerList.value = res.data.items || []

    // 更新分页信息，确保有默认值
    pagination.value = {
      page: res.data.page || 1,
      pageSize: res.data.pageSize || 5,
      total: res.data.total || 0,
      pages: res.data.pages || 0,
    }
  } catch (err) {
    console.error('获取轮播图失败:', err)
    error.value = true
    bannerList.value = [] // 出错时清空数据

    // 显示错误提示
    uni.showToast({
      title: '获取轮播图失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 点击轮播图项
const handleBannerClick = (item: any) => {
  if (item.hrefUrl) {
    uni.navigateTo({
      url: item.hrefUrl,
    })
  }
}

// 初始化加载数据
onMounted(() => {
  fetchBannerList()
})

// 添加重试方法
const retryFetch = () => {
  fetchBannerList()
}
</script>

<template>
  <!-- 轮播图容器 -->
  <view class="banner-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error">
      <image class="error-image" src="/static/images/error.png" />
      <text class="error-text">数据加载失败</text>
      <button class="retry-btn" @click="retryFetch">重新加载</button>
    </view>

    <!-- 轮播图 -->
    <swiper
      v-else-if="bannerList.length > 0"
      class="banner"
      :autoplay="true"
      :interval="3000"
      :circular="true"
      :indicator-dots="bannerList.length > 1"
      indicator-active-color="#27ba9b"
    >
      <swiper-item v-for="item in bannerList" :key="item.id" @click="handleBannerClick(item)">
        <image class="banner-image" :src="item.imgUrl" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 空状态 -->
    <view v-else class="empty">
      <image class="empty-image" src="/static/images/empty-banner.png" />
      <text class="empty-text">暂无轮播图数据</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.banner-container {
  position: relative;
  height: 340rpx;
  margin: 0 30rpx;

  .loading {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f7f7;
    border-radius: 16rpx;
  }

  .error {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f7f7f7;
    border-radius: 16rpx;

    .error-image {
      width: 150rpx;
      height: 150rpx;
      margin-bottom: 20rpx;
    }

    .error-text {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 20rpx;
    }

    .retry-btn {
      width: 200rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 30rpx;
    }
  }

  .banner {
    height: 100%;
    border-radius: 16rpx;
    overflow: hidden;

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }

  .empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f7f7f7;
    border-radius: 16rpx;

    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }

    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
