<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGoodsListAPI } from '@/api/goods'
import type { GoodsItem } from '@/types/goods'

import { getStatusText, getStatusClass, formatDate } from '@/utils/helpers'

const props = defineProps({
  refreshing: Boolean,
  loading: Boolean,
})

const emit = defineEmits(['refresh', 'load-more'])

// 商品列表数据
const goodsList = ref<GoodsItem[]>([
  {
    id: 1,
    name: '高等数学教材（第七版）',
    desc: '全新未使用，附带习题解答和教师手册',
    price: 45,
    originalPrice: 78,
    picture:
      'https://img.alicdn.com/bao/uploaded/i1/2201504846387/O1CN01JYwQjS1x0BvY1jZ8O_!!0-item_pic.jpg',
    pictures: [
      'https://img.alicdn.com/bao/uploaded/i1/2201504846387/O1CN01JYwQjS1x0BvY1jZ8O_!!0-item_pic.jpg',
      'https://img.alicdn.com/bao/uploaded/i4/2201504846387/O1CN01tKjv3T1x0BvXzQk9H_!!2201504846387.jpg',
    ],
    school: '清华大学',
    createdAt: '2023-05-15T10:30:00',
    status: 0,
    sellerId: 101,
    categoryId: 1,
  },
  {
    id: 2,
    name: 'iPhone 13 Pro 256GB',
    desc: '99新，国行在保至2024年3月，无划痕无磕碰',
    price: 5200,
    originalPrice: 8799,
    picture:
      'https://img.alicdn.com/bao/uploaded/i3/2206499166935/O1CN01f9zZ7C1x0BvXzQk9H_!!2206499166935.jpg',
    pictures: [
      'https://img.alicdn.com/bao/uploaded/i3/2206499166935/O1CN01f9zZ7C1x0BvXzQk9H_!!2206499166935.jpg',
      'https://img.alicdn.com/bao/uploaded/i4/2206499166935/O1CN01tKjv3T1x0BvXzQk9H_!!2206499166935.jpg',
    ],
    school: '北京大学',
    createdAt: '2023-06-20T14:15:00',
    status: 0,
    sellerId: 102,
    categoryId: 2,
  },
  {
    id: 3,
    name: '捷安特 ATX 860 山地车',
    desc: '2022款，27.5寸轮径，Shimano变速系统，骑行约500公里',
    price: 1800,
    originalPrice: 3298,
    picture:
      'https://img.alicdn.com/bao/uploaded/i2/2206499166935/O1CN01f9zZ7C1x0BvXzQk9H_!!2206499166935.jpg',
    pictures: [
      'https://img.alicdn.com/bao/uploaded/i2/2206499166935/O1CN01f9zZ7C1x0BvXzQk9H_!!2206499166935.jpg',
      'https://img.alicdn.com/bao/uploaded/i4/2206499166935/O1CN01tKjv3T1x0BvXzQk9H_!!2206499166935.jpg',
    ],
    school: '复旦大学',
    createdAt: '2023-07-10T09:45:00',
    status: 0,
    sellerId: 103,
    categoryId: 5,
  },
])
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

// 获取商品列表
const fetchGoodsList = async () => {
  if (props.loading || !hasMore.value) return

  try {
    const res = await getGoodsListAPI({
      page: currentPage.value,
      pageSize: pageSize.value,
    })

    if (currentPage.value === 1) {
      goodsList.value = res.list
    } else {
      goodsList.value = [...goodsList.value, ...res.list]
    }

    hasMore.value = res.list.length >= pageSize.value
    currentPage.value++
  } catch (error) {
    console.error('获取商品列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    emit('load-more', false)
  }
}

// 处理下拉刷新
const handleRefresh = () => {
  currentPage.value = 1
  hasMore.value = true
  fetchGoodsList().finally(() => {
    emit('refresh', false)
  })
}

// 跳转到商品详情
const gotoDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${id}`,
    animationType: 'slide-in-right',
    animationDuration: 300,
  })
}

// 初始化加载数据
onMounted(() => {
  fetchGoodsList()
})

// 监听下拉刷新和上拉加载
defineExpose({
  handleRefresh,
  fetchGoodsList,
})
</script>

<template>
  <scroll-view
    scroll-y
    class="scroll-view"
    refresher-enabled
    :refresher-triggered="refreshing"
    @refresherrefresh="handleRefresh"
    @scrolltolower="fetchGoodsList"
  >
    <view class="goods-list">
      <!-- 商品项 -->
      <view
        class="goods-item"
        v-for="item in goodsList"
        :key="item.id"
        @click="gotoDetail(item.id)"
      >
        <image class="image" :src="item.picture" mode="aspectFill" />
        <view class="info">
          <text class="title">{{ item.name }}</text>
          <text class="desc">{{ item.desc }}</text>
          <view class="price-section">
            <text class="price">¥{{ item.price }}</text>
            <text class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
          </view>
          <view class="meta">
            <text class="school">{{ item.school }}</text>
            <text class="time">{{ formatDate(item.createdAt) }}</text>
          </view>
          <!-- 商品状态标签 -->
          <view class="status-tag" :class="getStatusClass(item.status)">
            {{ getStatusText(item.status) }}
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-status">
        <text v-if="loading">加载中...</text>
        <text v-else-if="!hasMore && goodsList.length > 0">没有更多了~</text>
        <text v-else-if="goodsList.length === 0">暂无商品</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.scroll-view {
  height: calc(100vh - 500rpx);
}

.goods-list {
  margin: 0 30rpx;
  padding-bottom: 30rpx;

  .goods-item {
    display: flex;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    position: relative;

    .image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 20rpx;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .price-section {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .price {
          font-size: 32rpx;
          color: #ff5c5c;
          font-weight: bold;
        }

        .original-price {
          font-size: 24rpx;
          color: #999;
          text-decoration: line-through;
          margin-left: 10rpx;
        }
      }

      .meta {
        display: flex;
        justify-content: space-between;
        font-size: 22rpx;
        color: #999;
      }

      .status-tag {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        font-size: 20rpx;

        &.status-0 {
          background-color: rgba(39, 186, 155, 0.1);
          color: #27ba9b;
        }

        &.status-1 {
          background-color: rgba(255, 92, 92, 0.1);
          color: #ff5c5c;
        }

        &.status-2 {
          background-color: rgba(153, 153, 153, 0.1);
          color: #999;
        }
      }
    }
  }

  .loading-status {
    text-align: center;
    padding: 30rpx;
    font-size: 26rpx;
    color: #999;
  }
}
</style>
