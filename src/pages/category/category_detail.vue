<!-- src/pages/category/detail.vue -->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getCategoryDetailAPI } from '@/api/category_detail'

// 分类详情数据
const categoryDetail = ref<{
  id: number
  name: string
  categoryPic: string
  children: Array<{
    id: number
    name: string
  }>
  goods: Array<{
    id: number
    name: string
    picture: string
    price: number
    desc: string
  }>
}>()

// 加载状态
const loading = ref(false)
const error = ref(false)

// 页面加载
onLoad((query) => {
  if (!query.id) {
    uni.showToast({
      title: '缺少分类ID参数',
      icon: 'none',
    })
    uni.navigateBack()
    return
  }
  if (query.name) {
    uni.setNavigationBarTitle({
      title: decodeURIComponent(query.name),
    })
  }
  fetchCategoryDetail(Number(query.id))
})

// 获取分类详情
const fetchCategoryDetail = async (id: number) => {
  try {
    loading.value = true
    error.value = false

    const res = await getCategoryDetailAPI(id)

    if (res.code === 0 && res.data) {
      categoryDetail.value = res.data
    } else {
      throw new Error(res.message || '获取分类详情失败')
    }
  } catch (err) {
    console.error('获取分类详情失败:', err)
    error.value = true
    uni.showToast({
      title: '获取分类详情失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 点击商品
const handleGoodsClick = (goodsId: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${goodsId}`,
  })
}

// 点击子分类
const handleSubCategoryClick = (subCategoryId: number, subCategoryName: string) => {
  uni.navigateTo({
    url: `/pages/category/subCategoryDetail?id=${subCategoryId}&name=${encodeURIComponent(
      subCategoryName,
    )}`,
  })
}

// 重试加载
const retryFetch = () => {
  if (categoryDetail.value?.id) {
    fetchCategoryDetail(categoryDetail.value.id)
  }
}
</script>

<template>
  <view class="category-detail">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error">
      <image class="error-icon" src="/static/images/error.png" />
      <text class="error-text">加载失败，请重试</text>
      <button class="retry-btn" @click="retryFetch">重新加载</button>
    </view>

    <!-- 内容区域 -->
    <template v-else-if="categoryDetail">
      <!-- 分类头部 -->
      <view class="category-header">
        <image
          class="category-image"
          :src="categoryDetail.categoryPic || '/static/images/default-category.png'"
          mode="aspectFill"
        />
        <text class="category-name">{{ categoryDetail.name }}</text>
      </view>

      <!-- 子分类 -->
      <scroll-view v-if="categoryDetail.children.length > 0" scroll-x class="sub-category-scroll">
        <view
          v-for="sub in categoryDetail.children"
          :key="sub.id"
          class="sub-category-item"
          @click="handleSubCategoryClick(sub.id, sub.name)"
        >
          <text class="sub-category-name">{{ sub.name }}</text>
        </view>
      </scroll-view>

      <!-- 商品列表 -->
      <view class="goods-list">
        <view
          v-for="goods in categoryDetail.goods"
          :key="goods.id"
          class="goods-item"
          @click="handleGoodsClick(goods.id)"
        >
          <image class="goods-image" :src="goods.picture" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name">{{ goods.name }}</text>
            <text class="goods-desc">{{ goods.desc }}</text>
            <text class="goods-price">¥{{ goods.price.toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.category-detail {
  padding: 20rpx;

  .loading {
    height: 400rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .error {
    height: 400rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .error-icon {
      width: 120rpx;
      height: 120rpx;
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

  .category-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    .category-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .category-name {
      font-size: 36rpx;
      font-weight: bold;
    }
  }

  .sub-category-scroll {
    white-space: nowrap;
    margin-bottom: 30rpx;

    .sub-category-item {
      display: inline-block;
      padding: 10rpx 24rpx;
      margin-right: 20rpx;
      background-color: #f7f7f7;
      border-radius: 40rpx;

      &:last-child {
        margin-right: 0;
      }

      .sub-category-name {
        font-size: 26rpx;
        color: #333;
      }
    }
  }

  .goods-list {
    .goods-item {
      display: flex;
      padding: 20rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      .goods-image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
      }

      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods-name {
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .goods-desc {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 10rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .goods-price {
          font-size: 32rpx;
          color: #f03c3c;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
