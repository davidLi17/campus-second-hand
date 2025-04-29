<!-- src/components/CategoryPanel.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCategoryListAPI } from '@/api/category'

interface CategoryItem {
  id: number
  name: string
  categoryPic: string
}

const categories = ref<CategoryItem[]>([])
const loading = ref(false)
const error = ref(false)

const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = false

    const res = await getCategoryListAPI()

    if (res.code === 0 && res.data) {
      categories.value = res.data
    } else {
      throw new Error(res.message || '获取分类失败')
    }
  } catch (err) {
    console.error('获取分类失败:', err)
    error.value = true
    uni.showToast({
      title: '获取分类失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

const handleCategoryClick = (category: CategoryItem) => {
  uni.navigateTo({
    url: `/pages/category/category_detail?id=${category.id}&name=${encodeURIComponent(
      category.name,
    )}`,
  })
}

onMounted(() => {
  fetchCategories()
})

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
        <image
          class="category-image"
          :src="category.categoryPic || '/static/images/default-category.png'"
          mode="aspectFill"
        />
        <text class="category-name">{{ category.name }}</text>
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
    height: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .error {
    height: 200rpx;
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
      width: 160rpx;
      margin-right: 20rpx;
      text-align: center;

      &:last-child {
        margin-right: 0;
      }

      .category-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
      }

      .category-name {
        display: block;
        font-size: 26rpx;
        margin-top: 10rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
