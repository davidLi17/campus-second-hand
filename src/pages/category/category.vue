<!-- src/components/GoodsList.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getGoodsListAPI } from '@/api/goods'

// 商品数据
const goodsData = ref<
  Array<{
    id: number
    name: string
    categoryPic: string
    goods: Array<{
      id: number
      name: string
      picture: string
      price: number
      desc: string
    }>
  }>
>([])

// 加载状态
const loading = ref(false)
const error = ref(false)

// 获取商品列表
const fetchGoodsList = async () => {
  try {
    loading.value = true
    error.value = false

    const res = await getGoodsListAPI()

    if (res.code === 0 && res.data) {
      goodsData.value = res.data
    } else {
      throw new Error(res.message || '获取商品列表失败')
    }
  } catch (err) {
    console.error('获取商品列表失败:', err)
    error.value = true
    uni.showToast({
      title: '获取商品列表失败',
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

// 点击分类
const handleCategoryClick = (categoryId: number, categoryName: string) => {
  uni.navigateTo({
    url: `/pages/category/category_detail?id=${categoryId}&name=${encodeURIComponent(
      categoryName,
    )}`,
  })
}

// 初始化加载
onMounted(() => {
  fetchGoodsList()
})

// 重试加载
const retryFetch = () => {
  fetchGoodsList()
}
</script>

<template>
  <view class="goods-list-container">
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

    <!-- 商品列表 -->
    <template v-else>
      <view v-for="category in goodsData" :key="category.id" class="category-section">
        <!-- 分类标题 -->
        <view class="category-header" @click="handleCategoryClick(category.id, category.name)">
          <image
            class="category-image"
            :src="category.categoryPic || '/static/images/default-category.png'"
            mode="aspectFill"
          />
          <text class="category-name">{{ category.name }}</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>

        <!-- 商品列表 -->
        <scroll-view scroll-x class="goods-scroll">
          <view
            v-for="goods in category.goods"
            :key="goods.id"
            class="goods-item"
            @click="handleGoodsClick(goods.id)"
          >
            <image class="goods-image" :src="goods.picture" mode="aspectFill" />
            <text class="goods-name">{{ goods.name }}</text>
            <text class="goods-price">¥{{ goods.price.toFixed(2) }}</text>
          </view>
        </scroll-view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.goods-list-container {
  padding: 20rpx;

  .loading {
    height: 300rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .error {
    height: 300rpx;
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

  .category-section {
    margin-bottom: 40rpx;

    .category-header {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      margin-bottom: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .category-image {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .category-name {
        flex: 1;
        font-size: 32rpx;
        font-weight: bold;
      }
    }

    .goods-scroll {
      white-space: nowrap;

      .goods-item {
        display: inline-block;
        width: 220rpx;
        margin-right: 20rpx;
        background-color: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

        .goods-image {
          width: 220rpx;
          height: 220rpx;
        }

        .goods-name {
          display: block;
          padding: 10rpx;
          font-size: 26rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .goods-price {
          display: block;
          padding: 0 10rpx 10rpx;
          font-size: 28rpx;
          color: #f03c3c;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
