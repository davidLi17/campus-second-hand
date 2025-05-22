<template>
  <view class="order-page">
    <!-- 状态筛选 -->
    <scroll-view scroll-x class="status-tabs">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeStatus === tab.value }"
        @click="changeStatus(tab.value)"
      >
        <text>{{ tab.label }}</text>
        <view v-if="activeStatus === tab.value" class="tab-line"></view>
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <scroll-view
      scroll-y
      class="order-list"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
    >
      <!-- 加载状态 -->
      <uni-load-more
        :status="loading ? 'loading' : noMore ? 'noMore' : 'more'"
        :content-text="{
          contentdown: '上拉加载更多',
          contentrefresh: '正在加载...',
          contentnomore: '没有更多了',
        }"
      />

      <!-- 订单列表 -->
      <view v-for="(order, index) in orderList" :key="index" class="order-item">
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-no">订单号: {{ order.id }}</text>
          <text class="order-status" :style="{ color: getStatusColor(order.orderStatus) }">
            {{ getStatusText(order.orderStatus) }}
          </text>
        </view>

        <!-- 商品列表 -->
        <view
          v-for="(goods, gIndex) in order.goods"
          :key="gIndex"
          class="goods-item"
          @click="viewOrderDetail(order.id)"
        >
          <!-- 图片安全渲染 -->
          <image
            class="goods-image"
            :src="goods && goods.picture ? goods.picture : '/static/images/default-goods.png'"
            mode="aspectFill"
            v-if="goods"
          />
          <image
            class="goods-image"
            src="/static/images/default-goods.png"
            mode="aspectFill"
            v-else
          />

          <!-- 商品信息安全渲染 -->
          <view class="goods-info" v-if="goods">
            <text class="goods-name">{{ goods.name || '未知商品' }}</text>
            <text class="goods-spec">{{ goods.desc || '暂无描述' }}</text>
            <view class="goods-price">
              <!-- 价格安全处理 -->
              <text
                >¥{{
                  goods.price !== undefined && goods.price !== null
                    ? Number(goods.price).toFixed(2)
                    : '0.00'
                }}</text
              >
              <!-- 数量安全处理 -->
              <text class="goods-quantity">
                x{{ goods.count !== undefined && goods.count !== null ? goods.count : 1 }}
              </text>
            </view>
          </view>

          <!-- 商品信息为空时的兜底显示 -->
          <view class="goods-info" v-else>
            <text class="goods-name">商品信息加载中...</text>
            <text class="goods-spec">正在获取商品详情</text>
            <view class="goods-price">
              <text>¥0.00</text>
              <text class="goods-quantity">x1</text>
            </view>
          </view>
        </view>

        <!-- 订单汇总 -->
        <view class="order-summary">
          <text>共{{ order.totalNum }}件商品</text>
          <text
            >合计: <text class="total-price">¥{{ order.payAmount.toFixed(2) }}</text></text
          >
        </view>

        <!-- 订单操作 -->
        <view class="order-actions">
          <template v-if="order.orderStatus === OrderStatus.PENDING_PAYMENT">
            <button class="action-btn" @click.stop="cancelOrder(order)">取消订单</button>
            <button class="action-btn primary" @click.stop="goToPay(order)">去支付</button>
          </template>
          <template v-else-if="order.orderStatus === OrderStatus.PENDING_RECEIPT">
            <button class="action-btn" @click.stop="showLogistics(order.id)">查看物流</button>
            <button class="action-btn primary" @click.stop="confirmReceipt(order)">确认收货</button>
          </template>
          <template v-else-if="order.orderStatus === OrderStatus.PENDING_REVIEW">
            <button class="action-btn primary" @click.stop="evaluateOrder(order.id)">
              评价订单
            </button>
          </template>
          <template v-else>
            <button class="action-btn" @click.stop="viewOrderDetail(order.id)">查看详情</button>
            <button
              v-if="order.orderStatus === OrderStatus.COMPLETED"
              class="action-btn"
              @click.stop="deleteOrder(order.id)"
            >
              删除订单
            </button>
          </template>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && orderList.length === 0" class="empty">
        <image class="empty-icon" src="/static/images/empty-order.png" />
        <text class="empty-text">暂无订单</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { orderApi, OrderStatus, type OrderVO } from '@/api/order'

// 状态筛选选项
const statusTabs = ref([
  { label: '全部', value: 0 },
  { label: '待付款', value: OrderStatus.PENDING_PAYMENT },
  { label: '待发货', value: OrderStatus.PENDING_SHIPMENT },
  { label: '待收货', value: OrderStatus.PENDING_RECEIPT },
  { label: '待评价', value: OrderStatus.PENDING_REVIEW },
  { label: '已完成', value: OrderStatus.COMPLETED },
  { label: '已取消', value: OrderStatus.CANCELLED },
])

// 当前选中状态
const activeStatus = ref(0)

// 订单数据
const orderList = ref<OrderVO[]>([])
const loading = ref(false)
const refreshing = ref(false)
const noMore = ref(false)
const currentPage = ref(1)
const pageSize = 10

// 页面加载
onLoad(() => {
  loadOrders(true)
})

// 页面显示时刷新数据
onShow(() => {
  if (orderList.value.length > 0) {
    loadOrders(true)
  }
})

// 加载订单数据
const loadOrders = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    currentPage.value = 1
    noMore.value = false
    orderList.value = []
  } else if (noMore.value) {
    return
  }

  try {
    loading.value = true
    const params: {
      page: number
      pageSize: number
      orderStatus?: number
    } = {
      page: currentPage.value,
      pageSize,
    }

    // 只有当不是"全部"状态时才添加status参数
    if (activeStatus.value !== 0) {
      params.orderStatus = activeStatus.value
    }

    const res = await orderApi.getOrdersByPage(params)
    console.log('获取订单数据:', res)

    if (res.code === 0) {
      const data = res.data || {}
      const items = data.items || []

      if (reset) {
        orderList.value = items
      } else {
        orderList.value = [...orderList.value, ...items]
      }

      // 更准确的分页判断
      noMore.value = items.length < pageSize || currentPage.value >= (data.pages || 1)
      if (!noMore.value) currentPage.value++
    } else {
      throw new Error(res.message || '获取订单失败')
    }
  } catch (error) {
    console.error('获取订单失败:', error)
    uni.showToast({ title: error.message || '获取订单失败', icon: 'none' })
    noMore.value = true
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 切换状态
const changeStatus = (status: number) => {
  if (activeStatus.value === status) return
  activeStatus.value = status
  loadOrders(true)
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  loadOrders(true)
}

// 上拉加载更多
const onScrollToLower = () => {
  loadOrders(false)
}

// 查看订单详情
const viewOrderDetail = (orderId: string) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${orderId}`,
  })
}

// 取消订单
const cancelOrder = async (order: OrderVO) => {
  try {
    const { confirm } = await uni.showModal({
      title: '提示',
      content: '确定要取消此订单吗？',
      confirmText: '取消订单',
      confirmColor: '#e64340',
    })

    if (!confirm) return

    uni.showLoading({ title: '处理中...' })
    const res = await orderApi.updateOrderStatus(order.id, OrderStatus.CANCELLED)

    if (res.code === 0) {
      uni.showToast({ title: '取消成功', icon: 'success' })
      // 更新本地订单状态
      order.orderStatus = OrderStatus.CANCELLED
    } else {
      throw new Error(res.message || '取消失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    uni.showToast({ title: error.message || '取消订单失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 确认收货
const confirmReceipt = async (order: OrderVO) => {
  try {
    const { confirm } = await uni.showModal({
      title: '提示',
      content: '请确认已收到商品？',
      confirmText: '确认收货',
      confirmColor: '#27ba9b',
    })

    if (!confirm) return

    uni.showLoading({ title: '处理中...' })
    const res = await orderApi.updateOrderStatus(order.id, OrderStatus.COMPLETED)

    if (res.code === 0) {
      uni.showToast({ title: '确认收货成功', icon: 'success' })
      // 更新本地订单状态
      order.orderStatus = OrderStatus.COMPLETED
    } else {
      throw new Error(res.message || '确认收货失败')
    }
  } catch (error) {
    console.error('确认收货失败:', error)
    uni.showToast({ title: error.message || '确认收货失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 去支付
const goToPay = (order: OrderVO) => {
  uni.navigateTo({
    url: `/pages/order/pay?orderId=${order.id}&amount=${order.payAmount}`,
  })
}

// 查看物流
const showLogistics = (orderId: string) => {
  uni.navigateTo({
    url: `/pages/order/logistics?id=${orderId}`,
  })
}

// 评价订单
const evaluateOrder = (orderId: string) => {
  uni.navigateTo({
    url: `/pages/order/evaluate?orderId=${orderId}`,
  })
}

// 删除订单
const deleteOrder = async (orderId: string) => {
  try {
    const { confirm } = await uni.showModal({
      title: '提示',
      content: '确定要删除此订单吗？',
      confirmText: '删除订单',
      confirmColor: '#e64340',
    })

    if (!confirm) return

    uni.showLoading({ title: '处理中...' })
    const res = await orderApi.updateOrderStatus(orderId, OrderStatus.CANCELLED)

    if (res.code === 0) {
      uni.showToast({ title: '删除成功', icon: 'success' })
      // 从列表中移除
      orderList.value = orderList.value.filter((item) => item.id !== orderId)
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除订单失败:', error)
    uni.showToast({ title: error.message || '删除订单失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 获取订单状态文本
const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return '待付款'
    case OrderStatus.PENDING_SHIPMENT:
      return '待发货'
    case OrderStatus.PENDING_RECEIPT:
      return '待收货'
    case OrderStatus.PENDING_REVIEW:
      return '待评价'
    case OrderStatus.COMPLETED:
      return '已完成'
    case OrderStatus.CANCELLED:
      return '已取消'
    default:
      return '未知状态'
  }
}

// 获取订单状态颜色
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return '#e64340'
    case OrderStatus.PENDING_SHIPMENT:
      return '#1989fa'
    case OrderStatus.PENDING_RECEIPT:
      return '#07c160'
    case OrderStatus.PENDING_REVIEW:
      return '#ff976a'
    case OrderStatus.COMPLETED:
      return '#909399'
    case OrderStatus.CANCELLED:
      return '#909399'
    default:
      return '#909399'
  }
}
</script>

<style lang="scss" scoped>
.order-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .status-tabs {
    display: flex;
    background-color: #fff;
    padding: 0 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
    white-space: nowrap;

    .tab-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 0;
      margin-right: 40rpx;
      position: relative;

      text {
        font-size: 28rpx;
        color: #666;
      }

      &.active {
        text {
          color: #333;
          font-weight: bold;
        }
      }

      .tab-line {
        position: absolute;
        bottom: 0;
        width: 60rpx;
        height: 6rpx;
        background-color: #e64340;
        border-radius: 3rpx;
      }
    }
  }

  .order-list {
    flex: 9;
    padding: 20rpx;
    box-sizing: border-box;

    .order-item {
      background-color: #fff;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      overflow: hidden;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1rpx solid #f5f5f5;

        .order-no {
          font-size: 26rpx;
          color: #999;
        }

        .order-status {
          font-size: 28rpx;
          font-weight: bold;
        }
      }

      .goods-item {
        display: flex;
        padding: 20rpx;
        border-bottom: 1rpx solid #f5f5f5;

        .goods-image {
          width: 160rpx;
          height: 160rpx;
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
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .goods-spec {
            font-size: 24rpx;
            color: #999;
            margin-top: 10rpx;
          }

          .goods-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10rpx;
            font-size: 28rpx;
            color: #e64340;
            font-weight: bold;

            .goods-quantity {
              color: #999;
              font-weight: normal;
            }
          }
        }
      }

      .order-summary {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 20rpx;
        font-size: 28rpx;
        color: #666;

        .total-price {
          color: #e64340;
          font-weight: bold;
          margin-left: 10rpx;
        }
      }

      .order-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 20rpx;
        border-top: 1rpx solid #f5f5f5;

        .action-btn {
          height: 60rpx;
          line-height: 60rpx;
          padding: 0 30rpx;
          margin-left: 20rpx;
          font-size: 26rpx;
          color: #666;
          background-color: #fff;
          border: 1rpx solid #ddd;
          border-radius: 30rpx;

          &.primary {
            color: #e64340;
            border-color: #e64340;
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
