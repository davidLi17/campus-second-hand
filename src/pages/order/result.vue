<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { orderApi } from '@/api/order'

// 结果数据
const result = ref({
  status: '', // success | fail | cancel
  orderId: '',
  orderDetail: null as any,
})

// 页面加载
onLoad(async (query) => {
  if (!query.status || !query.orderId) {
    uni.showToast({ title: '参数错误', icon: 'none' })
    uni.navigateBack()
    return
  }

  result.value.status = query.status
  result.value.orderId = query.orderId

  // 获取订单详情
  const res = await orderApi.getOrderById(query.orderId)
  if (res.code === 0) {
    result.value.orderDetail = res.data
  }
})

// 查看订单详情
const viewOrderDetail = () => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${result.value.orderId}`,
  })
}

// 返回首页
const backToHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

// 重新支付
const repay = () => {
  uni.redirectTo({
    url: `/pages/order/pay?orderId=${result.value.orderId}&amount=${
      result.value.orderDetail?.payAmount || 0
    }`,
  })
}
</script>

<template>
  <view class="result-page">
    <!-- 结果图标 -->
    <view class="result-icon">
      <image
        v-if="result.status === 'success'"
        src="/static/images/success.png"
        class="icon-image"
      />
      <image
        v-else-if="result.status === 'cancel'"
        src="/static/images/cancel.png"
        class="icon-image"
      />
      <image v-else src="/static/images/fail.png" class="icon-image" />
    </view>

    <!-- 结果提示 -->
    <view class="result-message">
      <text v-if="result.status === 'success'">支付成功</text>
      <text v-else-if="result.status === 'cancel'">订单已取消</text>
      <text v-else>支付失败</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="info-label">订单号</text>
        <text class="info-value">{{ result.orderId }}</text>
      </view>
      <view v-if="result.orderDetail" class="info-item">
        <text class="info-label">支付金额</text>
        <text class="info-value">¥{{ result.orderDetail.payAmount.toFixed(2) }}</text>
      </view>
      <view v-if="result.orderDetail" class="info-item">
        <text class="info-label">支付时间</text>
        <text class="info-value">{{ result.orderDetail.payLatestTime }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button v-if="result.status !== 'success'" class="action-btn primary" @click="repay">
        重新支付
      </button>
      <button class="action-btn" @click="viewOrderDetail">查看订单</button>
      <button class="action-btn" @click="backToHome">返回首页</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.result-page {
  padding: 60rpx 40rpx;
  min-height: 100vh;
  background-color: #f7f7f7;
  text-align: center;

  .result-icon {
    margin: 60rpx 0 40rpx;

    .icon-image {
      width: 200rpx;
      height: 200rpx;
    }
  }

  .result-message {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 60rpx;
  }

  .order-info {
    padding: 40rpx;
    margin-bottom: 60rpx;
    background-color: #fff;
    border-radius: 16rpx;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 28rpx;
        color: #999;
      }

      .info-value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .action-buttons {
    .action-btn {
      margin-bottom: 30rpx;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 32rpx;
      color: #666;
      background-color: #fff;
      border-radius: 45rpx;

      &.primary {
        color: #fff;
        background-color: #e64340;
      }
    }
  }
}
</style>
