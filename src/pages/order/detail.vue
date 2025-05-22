<template>
  <view class="order-detail-page">
    <!-- 订单状态卡片 -->
    <view class="status-card" :style="{ background: statusCardBg }">
      <view class="status-icon">
        <uni-icons :type="statusIcon" size="30" :color="statusIconColor" />
      </view>
      <view class="status-info">
        <text class="status-text">{{ statusText }}</text>
        <text class="status-desc">{{ statusDesc }}</text>
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="address-card" v-if="orderDetail.address">
      <view class="address-header">
        <uni-icons type="location-filled" size="20" color="#666" />
        <text class="address-title">收货地址</text>
      </view>
      <view class="address-body">
        <view class="address-info">
          <text class="consignee">{{ orderDetail.consignee }}</text>
          <text class="phone">{{ orderDetail.phone }}</text>
        </view>
        <text class="address-detail">{{ orderDetail.address }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-card">
      <view class="card-header">
        <text class="card-title">商品信息</text>
      </view>
      <view class="goods-list">
        <view class="goods-item" @click="goToGoodsDetail(orderDetail.goods.id)">
          <image class="goods-image" :src="orderDetail.goods.picture" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name">{{ orderDetail.goods.name }}</text>
            <text class="goods-desc">{{ orderDetail.goods.desc }}</text>
            <view class="goods-price">
              <text>¥{{ orderDetail.goods.price }}</text>
              <text class="goods-quantity">x1</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-card">
      <view class="info-item">
        <text class="info-label">订单编号</text>
        <text class="info-value">{{ orderDetail.id }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">下单时间</text>
        <text class="info-value">{{ formatTime(orderDetail.orderTime) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">支付方式</text>
        <text class="info-value">{{ getPayMethodText(orderDetail.payChannel) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">配送方式</text>
        <text class="info-value">普通快递</text>
      </view>
    </view>

    <!-- 金额信息 -->
    <view class="amount-card">
      <view class="amount-item">
        <text class="amount-label">商品总价</text>
        <text class="amount-value">¥{{ orderDetail.totalPrice.toFixed(2) }}</text>
      </view>
      <view class="amount-item">
        <text class="amount-label">运费</text>
        <text class="amount-value">+¥{{ orderDetail.postFee.toFixed(2) }}</text>
      </view>
      <view class="amount-item total">
        <text class="amount-label">实付款</text>
        <text class="amount-value">¥{{ orderDetail.payAmount.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <template v-if="orderDetail.orderStatus === 1">
        <button class="action-btn" @click="cancelOrder">取消订单</button>
        <button class="action-btn primary" @click="goToPay">去支付</button>
      </template>
      <template v-else-if="orderDetail.orderStatus === 3">
        <button class="action-btn" @click="showLogistics">查看物流</button>
        <button class="action-btn primary" @click="confirmReceipt">确认收货</button>
      </template>
      <template v-else-if="orderDetail.orderStatus === 4">
        <button class="action-btn primary" @click="goToEvaluate">评价商品</button>
      </template>
      <template v-else>
        <button class="action-btn" @click="showLogistics">查看物流</button>
        <button class="action-btn" @click="deleteOrder">删除订单</button>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { orderApi, OrderStatus } from '@/api/order'
import { getGoodsDetailAPI } from '@/api/goods'
import dayjs from 'dayjs'

// 订单详情数据
const orderDetail = ref<Partial<OrderVO>>({})

// 加载状态
const loading = ref(false)

// 页面加载
onLoad(async (options) => {
  if (!options.id) {
    uni.showToast({ title: '订单参数错误', icon: 'none' })
    uni.navigateBack()
    return
  }

  await loadOrderDetail(options.id)
})

// 在loadOrderDetail中
const loadOrderDetail = async (orderId: string) => {
  try {
    loading.value = true
    const res = await orderApi.getOrderById(orderId)

    if (res.code === 0 && res.data) {
      orderDetail.value = {
        totalPrice: 0,
        postFee: 0,
        payAmount: 0,
        ...res.data,
      }
      const goodsDetail = await getGoodsDetailAPI(orderDetail.value.goodsId)
      console.log('商品详情:', goodsDetail)
      orderDetail.value.goods = goodsDetail.data
      console.log('订单详情:', orderDetail.value)
    } else {
      throw new Error(res.message || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    uni.showToast({ title: '获取订单详情失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 添加计算属性
const formattedAmounts = computed(() => ({
  totalPrice: (orderDetail.value.totalPrice || 0).toFixed(2),
  postFee: (orderDetail.value.postFee || 0).toFixed(2),
  payAmount: (orderDetail.value.payAmount || 0).toFixed(2),
}))

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 获取支付方式文本
const getPayMethodText = (method: number) => {
  switch (method) {
    case 1:
      return '微信支付'
    case 2:
      return '支付宝'
    case 3:
      return '余额支付'
    default:
      return '其他支付'
  }
}

// 订单状态相关计算属性
const statusText = computed(() => {
  switch (orderDetail.value.orderStatus) {
    case 1:
      return '待付款'
    case 2:
      return '待发货'
    case 3:
      return '待收货'
    case 4:
      return '待评价'
    case 5:
      return '已完成'
    case 6:
      return '已取消'
    default:
      return '未知状态'
  }
})

const statusDesc = computed(() => {
  switch (orderDetail.value.orderStatus) {
    case 1:
      return '请尽快完成支付，超时订单将自动取消'
    case 2:
      return '商家正在准备商品，请耐心等待'
    case 3:
      return '商品已发货，请注意查收'
    case 4:
      return '交易完成，期待您的评价'
    case 5:
      return '交易已完成'
    case 6:
      return '订单已取消'
    default:
      return ''
  }
})

const statusIcon = computed(() => {
  switch (orderDetail.value.orderStatus) {
    case 1:
      return 'wallet-filled'
    case 2:
      return 'shop-filled'
    case 3:
      return 'paperplane-filled'
    case 4:
      return 'chatbubble-filled'
    case 5:
      return 'checkmarkempty'
    case 6:
      return 'closeempty'
    default:
      return 'help'
  }
})

const statusIconColor = computed(() => {
  switch (orderDetail.value.orderStatus) {
    case 1:
      return '#ff9900'
    case 2:
      return '#1989fa'
    case 3:
      return '#07c160'
    case 4:
      return '#ff976a'
    case 5:
      return '#909399'
    case 6:
      return '#e64340'
    default:
      return '#909399'
  }
})

const statusCardBg = computed(() => {
  switch (orderDetail.value.orderStatus) {
    case 1:
      return 'linear-gradient(to right, #fff8e6, #fff1cc)'
    case 2:
      return 'linear-gradient(to right, #e6f7ff, #cceeff)'
    case 3:
      return 'linear-gradient(to right, #e6ffed, #ccffe4)'
    case 4:
      return 'linear-gradient(to right, #fff2e6, #ffe6cc)'
    case 5:
      return 'linear-gradient(to right, #f5f5f5, #e6e6e6)'
    case 6:
      return 'linear-gradient(to right, #fff0f0, #ffe6e6)'
    default:
      return 'linear-gradient(to right, #f5f5f5, #e6e6e6)'
  }
})

// 跳转到商品详情
const goToGoodsDetail = (goodsId: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${goodsId}`,
  })
}

// 取消订单
const cancelOrder = async () => {
  try {
    const { confirm } = await uni.showModal({
      title: '提示',
      content: '确定要取消此订单吗？',
      confirmText: '取消订单',
      confirmColor: '#e64340',
    })

    if (!confirm) return

    const res = await orderApi.updateOrderStatus(orderDetail.value.id!, OrderStatus.CANCELLED)

    if (res.code === 0) {
      uni.showToast({ title: '订单已取消', icon: 'success' })
      loadOrderDetail(orderDetail.value.id!)
    } else {
      throw new Error(res.message || '取消失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    uni.showToast({
      title: error.message || '取消订单失败',
      icon: 'none',
    })
  }
}

// 去支付
const goToPay = () => {
  uni.redirectTo({
    url: `/pages/order/pay?orderId=${orderDetail.value.id}&amount=${orderDetail.value.payAmount}`,
  })
}

// 确认收货
const confirmReceipt = async () => {
  try {
    const { confirm } = await uni.showModal({
      title: '提示',
      content: '请确认已收到商品？',
      confirmText: '确认收货',
      confirmColor: '#27ba9b',
    })

    if (!confirm) return

    //这里需要调用确认收货的API
    const res = await orderApi.updateOrderStatus(orderDetail.value.id!, OrderStatus.COMPLETED)

    if (res.code === 0) {
      uni.showToast({ title: '确认收货成功', icon: 'success' })
      loadOrderDetail(orderDetail.value.id!)
    } else {
      throw new Error(res.message || '确认收货失败')
    }
  } catch (error) {
    console.error('确认收货失败:', error)
    uni.showToast({
      title: error.message || '确认收货失败',
      icon: 'none',
    })
  }
}

// 查看物流
const showLogistics = () => {
  uni.navigateTo({
    url: `/pages/order/logistics?id=${orderDetail.value.id}`,
  })
}

// 评价商品
const goToEvaluate = () => {
  uni.navigateTo({
    url: `/pages/order/evaluate?orderId=${orderDetail.value.id}`,
  })
}

// 删除订单
const deleteOrder = async () => {
  try {
    const { confirm } = await uni.showModal({
      title: '提示',
      content: '确定要删除此订单吗？',
      confirmText: '删除订单',
      confirmColor: '#e64340',
    })

    if (!confirm) return

    // 这里需要调用删除订单的API
    const res = await orderApi.updateOrderStatus(orderDetail.value.id!, OrderStatus.CANCELLED)

    if (res.code === 0) {
      uni.showToast({ title: '订单已删除', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除订单失败:', error)
    uni.showToast({
      title: error.message || '删除订单失败',
      icon: 'none',
    })
  }
}
</script>

<style lang="scss" scoped>
.order-detail-page {
  padding-bottom: 120rpx;
  min-height: 100vh;
  background-color: #f7f7f7;

  .status-card {
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background: linear-gradient(to right, #fff8e6, #fff1cc);

    .status-icon {
      margin-right: 20rpx;
    }

    .status-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .status-text {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .status-desc {
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .address-card {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .address-header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .address-title {
        margin-left: 10rpx;
        font-size: 28rpx;
        font-weight: bold;
      }
    }

    .address-body {
      .address-info {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .consignee {
          font-size: 28rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }

        .phone {
          font-size: 26rpx;
          color: #666;
        }
      }

      .address-detail {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }

  .goods-card {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .card-header {
      margin-bottom: 20rpx;

      .card-title {
        font-size: 28rpx;
        font-weight: bold;
      }
    }

    .goods-list {
      .goods-item {
        display: flex;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

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

          .goods-desc {
            font-size: 24rpx;
            color: #999;
            margin: 10rpx 0;
          }

          .goods-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
    }
  }

  .info-card {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 26rpx;
        color: #666;
      }

      .info-value {
        font-size: 26rpx;
        color: #333;
      }
    }
  }

  .amount-card {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .amount-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .amount-label {
        font-size: 26rpx;
        color: #666;
      }

      .amount-value {
        font-size: 26rpx;
        color: #333;
      }

      &.total {
        .amount-label {
          font-weight: bold;
        }

        .amount-value {
          font-size: 32rpx;
          font-weight: bold;
          color: #e64340;
        }
      }
    }
  }

  .action-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 10;

    .action-btn {
      height: 70rpx;
      line-height: 70rpx;
      padding: 0 30rpx;
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #666;
      background-color: #fff;
      border: 1rpx solid #ddd;
      border-radius: 35rpx;

      &.primary {
        color: #e64340;
        border-color: #e64340;
      }
    }
  }
}
</style>
