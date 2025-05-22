<!-- src/pages/category/category_detail.vue -->
<template>
  <view class="category-detail-page">
    <!-- 分类标题 -->
    <view class="category-header">
      <text class="category-title">{{ categoryName }}</text>
    </view>

    <!-- 商品列表 -->
    <scroll-view
      scroll-y
      class="goods-list"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
    >
      <!-- 商品网格 -->
      <view class="goods-grid">
        <view
          v-for="(goods, index) in goodsList"
          :key="index"
          class="goods-item"
          @click="viewGoodsDetail(goods.id)"
        >
          <image class="goods-image" :src="goods.picture" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name">{{ goods.name }}</text>
            <text class="goods-price">¥{{ goods.price.toFixed(2) }}</text>
            <view class="goods-meta">
              <text class="goods-seller">{{ goods.sellerName }}</text>
              <view class="goods-stats">
                <uni-icons type="heart" size="14" color="#999"></uni-icons>
                <text>{{ goods.likeCount || 0 }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <uni-load-more
        :status="loading ? 'loading' : noMore ? 'noMore' : 'more'"
        :content-text="{
          contentdown: '上拉加载更多',
          contentrefresh: '正在加载...',
          contentnomore: '没有更多了',
        }"
      />

      <!-- 空状态 -->
      <view v-if="!loading && goodsList.length === 0" class="empty">
        <image class="empty-icon" src="/static/images/empty-goods.png" />
        <text class="empty-text">该分类下暂无商品</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { categoryApi } from '@/api/category1'

// 路由参数
const categoryId = ref<number>(0)
const categoryName = ref<string>('')

// 商品数据
const goodsList = ref<any[]>([])
const loading = ref(false)
const refreshing = ref(false)
const noMore = ref(false)
const currentPage = ref(1)
const pageSize = 10

// 页面加载
onLoad((query) => {
  if (!query.id || !query.name) {
    uni.showToast({ title: '分类参数错误', icon: 'none' })
    uni.navigateBack()
    return
  }

  categoryId.value = Number(query.id)
  categoryName.value = decodeURIComponent(query.name)
  uni.setNavigationBarTitle({
    title: categoryName.value,
  })

  // 加载商品数据
  loadGoods(true)
})

// 加载商品数据
const loadGoods = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    currentPage.value = 1
    noMore.value = false
  } else if (noMore.value) {
    return
  }

  try {
    loading.value = true
    const res = await categoryApi.getGoodsByCategory({
      categoryId: categoryId.value,
      page: currentPage.value,
      pageSize,
    })

    if (res.code === 0 && res.data) {
      const newGoods = res.data.items || []

      if (reset) {
        goodsList.value = newGoods
      } else {
        goodsList.value = [...goodsList.value, ...newGoods]
      }

      // 判断是否还有更多数据
      noMore.value = newGoods.length < pageSize || currentPage.value >= (res.data.pages || 1)
      currentPage.value++
    } else {
      throw new Error(res.message || '获取商品失败')
    }
  } catch (error) {
    console.error('获取商品失败:', error)
    uni.showToast({ title: '获取商品失败', icon: 'none' })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  loadGoods(true)
}

// 上拉加载更多
const onScrollToLower = () => {
  loadGoods(false)
}

// 查看商品详情
const viewGoodsDetail = (goodsId: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${goodsId}`,
  })
}
</script>

<style lang="scss" scoped>
.category-detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .category-header {
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f5f5f5;

    .category-title {
      font-size: 36rpx;
      font-weight: bold;
    }
  }

  .goods-list {
    flex: 1;
    padding: 20rpx;
    box-sizing: border-box;

    .goods-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;

      .goods-item {
        background-color: #fff;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

        .goods-image {
          width: 100%;
          height: 320rpx;
        }

        .goods-info {
          padding: 20rpx;

          .goods-name {
            font-size: 28rpx;
            color: #333;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            margin-bottom: 10rpx;
            min-height: 80rpx;
          }

          .goods-price {
            font-size: 32rpx;
            color: #e64340;
            font-weight: bold;
            margin-bottom: 10rpx;
            display: block;
          }

          .goods-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 24rpx;
            color: #999;

            .goods-stats {
              display: flex;
              align-items: center;

              text {
                margin-left: 6rpx;
              }
            }
          }
        }
      }
    }

    .empty {
      padding-top: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .empty-icon {
        width: 300rpx;
        height: 300rpx;
        margin-bottom: 30rpx;
      }

      .empty-text {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
}
</style>
