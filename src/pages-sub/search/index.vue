<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { searchGoodsAPI } from '@/api/goods'

// 定义商品类型
interface GoodsItem {
  id: number
  name: string
  price: number
  picture: string
  sellerName: string
  likeCount: number
  categoryName: string
}

// 搜索参数
const searchParams = ref({
  name: '',
  page: 1,
  pageSize: 10,
})

// 搜索结果
const searchResult = ref<{
  items: GoodsItem[]
  total: number
  pages: number
}>({
  items: [],
  total: 0,
  pages: 0,
})

// 加载状态
const loading = ref(false)
const finished = ref(false)

// 页面加载时获取初始搜索参数
onLoad((options) => {
  if (options?.name) {
    searchParams.value.name = options.name
    doSearch()
  }
})

// 执行搜索
const doSearch = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const res = await searchGoodsAPI(searchParams.value)

    if (res.code === 0) {
      // 如果是第一页，重置数据
      if (searchParams.value.page === 1) {
        searchResult.value.items = res.data.items
      } else {
        searchResult.value.items.push(...res.data.items)
      }

      searchResult.value.total = res.data.total
      searchResult.value.pages = res.data.pages

      // 检查是否还有更多数据
      if (searchParams.value.page >= res.data.pages) {
        finished.value = true
      }
    }
  } finally {
    loading.value = false
  }
}

// 搜索输入处理
const handleSearch = () => {
  searchParams.value.page = 1
  finished.value = false
  doSearch()
}

// 加载更多
const loadMore = () => {
  if (finished.value || loading.value) return

  searchParams.value.page++
  doSearch()
}

// 跳转商品详情
const gotoDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages-sub/goods/detail?id=${id}`,
  })
}
</script>

<template>
  <view class="search-page">
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar
        v-model="searchParams.name"
        placeholder="搜索教材、电子产品..."
        @confirm="handleSearch"
        @cancel="uni.navigateBack()"
        cancel-text="取消"
        bgColor="#f5f5f5"
        radius="40"
      />
    </view>

    <!-- 搜索结果 -->
    <scroll-view class="result-container" scroll-y @scrolltolower="loadMore">
      <!-- 商品列表 -->
      <view class="goods-list">
        <view
          class="goods-item"
          v-for="item in searchResult.items"
          :key="item.id"
          @click="gotoDetail(item.id)"
        >
          <image class="goods-image" :src="item.picture" mode="aspectFill" />
          <view class="goods-info">
            <view class="goods-name">{{ item.name }}</view>
            <view class="goods-price">¥{{ item.price }}</view>
            <view class="goods-seller">{{ item.sellerName }}</view>
            <view class="goods-meta">
              <text class="category">{{ item.categoryName }}</text>
              <text class="likes">
                <uni-icons type="heart" size="14" color="#999" />
                {{ item.likeCount }}
              </text>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="load-status">
          <uni-load-more :status="loading ? 'loading' : finished ? 'noMore' : 'more'" />
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="!loading && searchResult.items.length === 0">
        <image src="/static/images/empty-search.png" mode="aspectFit" />
        <text class="empty-text">没有找到相关商品</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.search-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .search-box {
    padding: 20rpx 30rpx;
    background-color: #fff;
  }

  .result-container {
    flex: 1;
    padding: 0 20rpx;
  }

  .goods-list {
    .goods-item {
      display: flex;
      padding: 30rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;

      .goods-image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }

      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods-name {
          font-size: 28rpx;

          line-height: 1.4;
        }

        .goods-price {
          font-size: 32rpx;
          color: #f40;
          font-weight: bold;
          margin: 10rpx 0;
        }

        .goods-seller {
          font-size: 24rpx;
          color: #666;
        }

        .goods-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 10rpx;
          font-size: 24rpx;
          color: #999;

          .likes {
            display: flex;
            align-items: center;
          }
        }
      }
    }

    .load-status {
      padding: 30rpx 0;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 100rpx;

    image {
      width: 300rpx;
      height: 300rpx;
      opacity: 0.6;
    }

    .empty-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
