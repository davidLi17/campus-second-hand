<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { goodsApi, GoodStatus, type Good } from '@/api/user_goods'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

// 商品数据
const goodsList = ref<Good[]>([])
const loading = ref(false)
const finished = ref(false)
const queryParams = ref({
  page: 1,
  pageSize: 10,
  status: GoodStatus.ON_SALE,
})

// 加载商品列表
const loadGoodsList = async (reset = false) => {
  if (loading.value) return

  loading.value = true

  try {
    if (reset) {
      queryParams.value.page = 1
      goodsList.value = []
      finished.value = false
    }

    const res = await goodsApi.getSellGoods(queryParams.value)

    if (res.data.items.length === 0) {
      finished.value = true
    } else {
      goodsList.value = reset ? res.data.items : [...goodsList.value, ...res.data.items]
      queryParams.value.page++
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    uni.stopPullDownRefresh()
  }
}

// 修改筛选状态
const changeFilterStatus = (status: number) => {
  queryParams.value.status = status
  loadGoodsList(true)
}

// 修改商品状态
const handleChangeStatus = async (good: Good) => {
  try {
    const newStatus = good.status === GoodStatus.ON_SALE ? GoodStatus.OFF_SHELF : GoodStatus.ON_SALE

    await goodsApi.updateGood({
      ...good,
      status: newStatus,
    })

    uni.showToast({ title: '状态修改成功', icon: 'success' })
    loadGoodsList(true)
  } catch (error) {
    uni.showToast({ title: '操作失败', icon: 'error' })
  }
}

// 删除商品（通过设置状态为DELETED）
const handleDelete = (good: Good) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          if (good.id) {
            await goodsApi.deleteGood(good.id)
          }

          // await goodsApi.updateGood({
          //   ...good,
          //   status: GoodStatus.DELETED,
          // })
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadGoodsList(true)
        } catch (error) {
          uni.showToast({ title: '删除失败', icon: 'error' })
        }
      }
    },
  })
}

// 跳转到编辑页面
const navigateToEdit = (id?: number) => {
  uni.navigateTo({
    url: `/pages/publish/publish?id=${id || ''}`,
  })
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case GoodStatus.ON_SALE:
      return '出售中'
    case GoodStatus.OFF_SHELF:
      return '已下架'
    case GoodStatus.SOLD_OUT:
      return '已售出'
    case GoodStatus.DELETED:
      return '已删除'
    default:
      return '未知状态'
  }
}

// 初始化加载
onMounted(() => {
  loadGoodsList(true)
})

// 下拉刷新
onPullDownRefresh(() => {
  loadGoodsList(true)
})

// 上拉加载更多
onReachBottom(() => {
  if (!finished.value) {
    loadGoodsList()
  }
})
</script>

<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">我出售的商品</text>
      <button class="add-btn" @click="navigateToEdit()">发布商品</button>
    </view>

    <!-- 状态筛选 -->
    <view class="filter-tabs">
      <text
        :class="['tab-item', queryParams.status === GoodStatus.ON_SALE && 'active']"
        @click="changeFilterStatus(GoodStatus.ON_SALE)"
      >
        出售中
      </text>
      <text
        :class="['tab-item', queryParams.status === GoodStatus.SOLD_OUT && 'active']"
        @click="changeFilterStatus(GoodStatus.SOLD_OUT)"
      >
        已售出
      </text>
      <text
        :class="['tab-item', queryParams.status === GoodStatus.OFF_SHELF && 'active']"
        @click="changeFilterStatus(GoodStatus.OFF_SHELF)"
      >
        已下架
      </text>
    </view>

    <!-- 商品列表 -->
    <scroll-view
      scroll-y
      class="goods-scroll"
      refresher-enabled
      @refresherrefresh="loadGoodsList(true)"
    >
      <view v-if="goodsList.length === 0 && !loading" class="empty-tip">
        <text>暂无商品数据</text>
      </view>

      <view v-for="item in goodsList" :key="item.id" class="goods-item">
        <image
          :src="item.picture || '/static/images/default-good.png'"
          class="goods-img"
          mode="aspectFill"
        />

        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-price">¥{{ item.price?.toFixed(2) }}</text>
          <text class="goods-status" :class="`status-${item.status}`">
            {{ getStatusText(item.status!) }}
          </text>
          <text class="goods-desc">{{ item.desc }}</text>

          <view class="goods-actions">
            <button size="mini" @click="navigateToEdit(item.id)">编辑</button>
            <button size="mini" type="warn" @click="handleDelete(item)">删除</button>
            <button
              size="mini"
              :type="item.status === GoodStatus.ON_SALE ? 'default' : 'primary'"
              @click="handleChangeStatus(item)"
            >
              {{ item.status === GoodStatus.ON_SALE ? '下架' : '上架' }}
            </button>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-status">
        <text v-if="loading">加载中...</text>
        <text v-if="finished && goodsList.length > 0">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f7f7f7;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .title {
    font-size: 36rpx;
    font-weight: bold;
  }

  .add-btn {
    margin: 0;
    padding: 0 20rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    background-color: #07c160;
    color: white;
    border-radius: 30rpx;
  }
}

.filter-tabs {
  display: flex;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 10rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 15rpx 0;
    font-size: 28rpx;
    color: #666;

    &.active {
      color: #07c160;
      font-weight: bold;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 4rpx;
        background: #07c160;
      }
    }
  }
}

.goods-scroll {
  height: calc(100% - 120rpx);
}

.goods-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.goods-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;

  .goods-name {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .goods-price {
    color: #e74c3c;
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .goods-status {
    font-size: 24rpx;
    padding: 4rpx 10rpx;
    border-radius: 4rpx;
    align-self: flex-start;
    margin-bottom: 10rpx;

    &.status-1 {
      // 出售中
      background-color: #e8f5e9;
      color: #07c160;
    }

    &.status-2 {
      // 已下架
      background-color: #fff3e0;
      color: #ff9500;
    }

    &.status-3 {
      // 已售出
      background-color: #e3f2fd;
      color: #1989fa;
    }

    &.status-4 {
      // 已删除
      background-color: #ffebee;
      color: #ff4d4f;
    }
  }

  .goods-desc {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.goods-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;

  button {
    margin: 0;
    min-width: 120rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 26rpx;
    border-radius: 30rpx;
  }
}

.empty-tip {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.loading-status {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
