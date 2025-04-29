<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http } from '@/utils/http'

// 分类数据接口
interface CategoryItem {
  id: number
  name: string
  categoryPic: string
  children: CategoryItem[]
  goods: {
    id: number
    name: string
    picture: string
    price: number
    // 其他商品字段...
  }[]
}

// 分类数据
const categories = ref<CategoryItem[]>([])
const loading = ref(false)
const error = ref(false)

// 获取分类数据
const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = false

    const res = await http<{
      code: number
      data: CategoryItem[]
      message: string
    }>({
      method: 'GET',
      url: '/home/category/head',
    })

    if (res.code === 0 && res.data) {
      categories.value = res.data
    } else {
      throw new Error(res.message || '获取分类数据失败')
    }
  } catch (err) {
    console.error('获取分类数据失败:', err)
    error.value = true
    uni.showToast({
      title: '获取分类数据失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 点击分类项
const handleCategoryClick = (category: CategoryItem) => {
  uni.navigateTo({
    url: `/pages/category/list?id=${category.id}&name=${encodeURIComponent(category.name)}`,
  })
}

// 点击商品
const handleGoodsClick = (goodsId: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${goodsId}`,
  })
}

// 初始化加载数据
onMounted(() => {
  fetchCategories()
})

// 重试加载
const retryFetch = () => {
  fetchCategories()
}
</script>

<template>
  <view class="category-panel">
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

    <!-- 分类内容 -->
    <scroll-view v-else scroll-x class="category-scroll">
      <view
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @click="handleCategoryClick(category)"
      >
        <!-- 分类图片 -->
        <image
          class="category-image"
          :src="category.categoryPic || '/static/images/default-category.png'"
          mode="aspectFill"
        />

        <!-- 分类名称 -->
        <text class="category-name">{{ category.name }}</text>

        <!-- 子分类 -->
        <view v-if="category.children && category.children.length > 0" class="sub-categories">
          <text v-for="child in category.children" :key="child.id" class="sub-category">
            {{ child.name }}
          </text>
        </view>

        <!-- 推荐商品 -->
        <scroll-view
          v-if="category.goods && category.goods.length > 0"
          scroll-x
          class="goods-scroll"
        >
          <view
            v-for="goods in category.goods"
            :key="goods.id"
            class="goods-item"
            @click.stop="handleGoodsClick(goods.id)"
          >
            <image class="goods-image" :src="goods.picture" mode="aspectFill" />
            <text class="goods-name">{{ goods.name }}</text>
            <text class="goods-price">¥{{ goods.price.toFixed(2) }}</text>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.category-panel {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

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

  .category-scroll {
    white-space: nowrap;
    width: 100%;

    .category-item {
      display: inline-block;
      width: 240rpx;
      margin-right: 20rpx;
      vertical-align: top;

      &:last-child {
        margin-right: 0;
      }

      .category-image {
        width: 240rpx;
        height: 240rpx;
        border-radius: 12rpx;
      }

      .category-name {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        margin: 10rpx 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sub-categories {
        margin: 10rpx 0;

        .sub-category {
          display: inline-block;
          font-size: 24rpx;
          color: #666;
          background-color: #f7f7f7;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          margin-right: 8rpx;
          margin-bottom: 8rpx;
        }
      }

      .goods-scroll {
        white-space: nowrap;
        width: 100%;

        .goods-item {
          display: inline-block;
          width: 180rpx;
          margin-right: 12rpx;

          .goods-image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 8rpx;
          }

          .goods-name {
            display: block;
            font-size: 24rpx;
            margin-top: 6rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .goods-price {
            display: block;
            font-size: 26rpx;
            color: #f03c3c;
            font-weight: bold;
            margin-top: 4rpx;
          }
        }
      }
    }
  }
}
</style>
