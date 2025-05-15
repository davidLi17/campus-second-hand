<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getHotGoodsAPI } from '@/api/goods'

interface GoodsItem {
  id: number
  name: string
  price: number
  picture: string
  likeCount: number
  sellerName: string
  categoryName: string
}

const props = defineProps({
  categoryId: {
    type: Number,
    default: 40,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
})

const goodsList = ref<GoodsItem[]>([])
const loading = ref(false)
const finished = ref(false)
const currentPage = ref(1)

const fetchGoodsList = async () => {
  if (loading.value || finished.value) return

  loading.value = true

  try {
    const res = await getHotGoodsAPI({
      id: props.categoryId,
      limit: props.pageSize,
    })

    if (res.code === 0) {
      if (res.data.length === 0) {
        finished.value = true
      } else {
        goodsList.value = [...goodsList.value, ...res.data]
        currentPage.value++
      }
    }
  } finally {
    loading.value = false
  }
}

const gotoDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${id}`,
  })
}

const onRefresh = async () => {
  goodsList.value = []
  currentPage.value = 1
  finished.value = false
  await fetchGoodsList()
}

// 初始化加载
onMounted(() => {
  fetchGoodsList()
})

// 监听分类变化
watch(
  () => props.categoryId,
  () => {
    goodsList.value = []
    currentPage.value = 1
    finished.value = false
    fetchGoodsList()
  },
)
</script>

<template>
  <view class="vertical-goods-list">
    <!-- 标题栏 -->
    <view v-if="showHeader" class="header">
      <text class="title">热门商品</text>
      <text class="more" @click="navigateToGoodsList(categoryId)">查看更多</text>
    </view>

    <!-- 商品列表 -->
    <scroll-view
      class="list-container"
      scroll-y
      refresher-enabled
      :refresher-triggered="loading"
      @refresherrefresh="onRefresh"
      @scrolltolower="fetchGoodsList"
    >
      <view
        v-for="item in goodsList"
        :key="item.id"
        class="goods-item"
        @click="gotoDetail(item.id)"
      >
        <image class="goods-image" :src="item.picture" mode="aspectFill" lazy-load />
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-price">¥{{ item.price }}</text>
          <view class="goods-meta">
            <text class="seller">{{ item.sellerName }}</text>
            <text class="likes">
              <uni-icons type="heart" size="12" color="#999" />
              {{ item.likeCount }}
            </text>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <uni-load-more :status="loading ? 'loading' : finished ? 'noMore' : 'more'" />

      <!-- 空状态 -->
      <view v-if="!loading && goodsList.length === 0" class="empty">
        <image src="/static/images/empty-goods.png" mode="aspectFit" />
        <text class="text">暂无热门商品</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.vertical-goods-list {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .more {
      font-size: 24rpx;
      color: #999;
    }
  }

  .list-container {
    height: calc(100vh - 200rpx); /* 根据实际布局调整 */

    .goods-item {
      display: flex;
      padding: 20rpx;
      margin-bottom: 20rpx;
      background-color: #f9f9f9;
      border-radius: 12rpx;

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
          color: #333;
          line-height: 1.4;
        }

        .goods-price {
          font-size: 32rpx;
          color: #f40;
          font-weight: bold;
          margin: 8rpx 0;
        }

        .goods-meta {
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          color: #999;

          .likes {
            display: flex;
            align-items: center;
          }
        }
      }
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 100rpx;

      image {
        width: 200rpx;
        height: 200rpx;
        opacity: 0.6;
      }

      .text {
        margin-top: 16rpx;
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}
</style>
