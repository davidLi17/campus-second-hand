<script setup lang="ts">
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { orderApi } from '@/api/order'

// 支付数据
const payData = ref({
  orderId: '',
  orderNo: '', // 订单编号
  amount: 0,
  goodsName: '', // 商品名称
  payMethod: 2, // 默认支付宝支付
  countdown: 900, // 15分钟倒计时
  orderStatus: 0, // 订单状态
})

// 二维码相关
const qrCodeUrl = ref('') // 支付二维码URL
const showQrCode = ref(false) // 是否显示二维码弹窗
const paying = ref(false) // 是否正在支付

// 倒计时
const countdownText = ref('15:00')
let timer: any = null
const loading = ref(false)

// 页面加载
onLoad(async (query) => {
  if (!query.orderId || !query.amount) {
    uni.showToast({ title: '订单参数错误', icon: 'none' })
    uni.navigateBack()
    return
  }

  payData.value.orderId = query.orderId
  payData.value.amount = Number(query.amount)

  // 获取订单详情
  await getOrderDetail()

  // 开始倒计时
  startCountdown()
})

// 获取订单详情
const getOrderDetail = async () => {
  try {
    loading.value = true
    const res = await orderApi.getOrderById(payData.value.orderId)

    if (res.code === 0 && res.data) {
      const order = res.data
      payData.value.orderNo = order.id
      payData.value.goodsName = order.goods?.[0]?.name || '商品'
      payData.value.orderStatus = order.orderStatus || 0

      // 如果订单状态不是待支付，跳转到结果页
      if (order.orderStatus !== 1) {
        handleOrderStatusChange(order.orderStatus)
        return
      }
    } else {
      throw new Error(res.message || '获取订单失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    uni.showToast({ title: '获取订单信息失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 处理订单状态变化
const handleOrderStatusChange = (status: number) => {
  let resultStatus = ''
  switch (status) {
    case 2: // 已支付待发货
    case 3: // 已发货
      resultStatus = 'success'
      break
    case 5: // 已完成
      resultStatus = 'completed'
      break
    case 6: // 已取消
      resultStatus = 'cancel'
      break
    default:
      resultStatus = 'unknown'
  }

  uni.redirectTo({
    url: `/pages/order/result?status=${resultStatus}&orderId=${payData.value.orderId}`,
  })
}

// 开始倒计时
const startCountdown = () => {
  clearInterval(timer)

  timer = setInterval(() => {
    if (payData.value.countdown <= 0) {
      clearInterval(timer)
      handleOrderTimeout()
      return
    }

    payData.value.countdown--
    updateCountdownText()
  }, 1000)
}

// 更新倒计时显示
const updateCountdownText = () => {
  const minutes = Math.floor(payData.value.countdown / 60)
  const seconds = payData.value.countdown % 60
  countdownText.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 订单超时处理
const handleOrderTimeout = async () => {
  try {
    // 自动取消超时订单
    const res = await orderApi.cancelOrder(payData.value.orderId)

    if (res.code === 0) {
      uni.showToast({ title: '支付超时，订单已取消', icon: 'none' })
      uni.redirectTo({
        url: `/pages/order/result?status=timeout&orderId=${payData.value.orderId}`,
      })
    }
  } catch (error) {
    console.error('取消超时订单失败:', error)
  }
}

// 选择支付方式
const selectPayMethod = (method: number) => {
  payData.value.payMethod = method
}

// 确认支付
const confirmPay = async () => {
  if (payData.value.orderStatus !== 1) {
    uni.showToast({ title: '订单状态已变更，请刷新', icon: 'none' })
    return
  }

  if (paying.value) return
  paying.value = true

  try {
    uni.showLoading({ title: '正在生成支付...', mask: true })

    // 根据支付方式调用不同API
    let res
    if (payData.value.payMethod === 2) {
      res = await orderApi.aliPay(payData.value.orderId)
      console.log('支付宝支付返回:', res)
    } else {
      // 这里可以添加微信支付等其他支付方式
      throw new Error('暂不支持该支付方式')
    }

    uni.hideLoading()

    if (res.code === 0) {
      // 支付宝支付会返回支付页面URL或二维码
      if (res.data) {
        // 显示支付二维码或跳转支付页面
        qrCodeUrl.value = res.data.qrCode || res.data.payUrl || ''
        if (qrCodeUrl.value) {
          showQrCode.value = true
          // 开始轮询支付状态
          checkPaymentStatus()
        } else {
          // 如果没有二维码，可能是直接跳转支付页面
          handlePaymentResponse(res.data)
        }
      }
    } else {
      throw new Error(res.message || '获取支付信息失败')
    }
  } catch (error) {
    uni.hideLoading()
    console.error('支付失败:', error)
    uni.showToast({
      title: error.message || '支付失败',
      icon: 'none',
    })
  } finally {
    paying.value = false
  }
}

// 处理支付响应
const handlePaymentResponse = (data: any) => {
  // 小程序环境处理支付宝支付链接
  if (data && typeof data === 'string') {
    // 直接使用web-view组件打开支付链接
    uni.navigateTo({
      url: `/pages/common/webview?url=${encodeURIComponent(data)}`,
      fail: (err) => {
        console.error('跳转支付页面失败:', err)
        uni.showToast({ title: '跳转支付失败', icon: 'none' })
      },
    })
  } else {
    uni.showToast({ title: '不支持的支付方式', icon: 'none' })
  }
}

// 轮询检查支付状态
let checkTimer: any = null
const checkPaymentStatus = async () => {
  // 先清除之前的定时器
  clearTimeout(checkTimer)

  try {
    const res = await orderApi.getOrderById(payData.value.orderId)

    if (res.code === 0 && res.data) {
      // 检查订单状态是否已更新
      if (res.data.orderStatus !== 1) {
        // 支付成功
        showQrCode.value = false
        handleOrderStatusChange(res.data.orderStatus)
        return
      }
    }

    // 继续轮询，每3秒检查一次
    checkTimer = setTimeout(checkPaymentStatus, 3000)
  } catch (error) {
    console.error('检查支付状态失败:', error)
    // 出错后继续轮询
    checkTimer = setTimeout(checkPaymentStatus, 3000)
  }
}

// 关闭二维码弹窗
const closeQrCode = () => {
  showQrCode.value = false
  // 清除轮询定时器
  clearTimeout(checkTimer)
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

    const res = await orderApi.cancelOrder(payData.value.orderId)

    if (res.code === 0) {
      uni.redirectTo({
        url: `/pages/order/result?status=cancel&orderId=${payData.value.orderId}`,
      })
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

// 页面卸载时清除定时器
onUnload(() => {
  clearInterval(timer)
  clearTimeout(checkTimer)
})
</script>

<template>
  <view class="pay-page">
    <!-- 加载状态 -->
    <uni-load-more v-if="loading" status="loading" />

    <!-- 订单信息 -->
    <view v-else class="order-info">
      <text class="amount-label">应付金额</text>
      <text class="amount">¥{{ payData.amount.toFixed(2) }}</text>
      <text class="order-no">订单编号: {{ payData.orderNo }}</text>
      <text class="goods-name">{{ payData.goodsName }}</text>
      <text class="countdown">剩余支付时间 {{ countdownText }}</text>
    </view>

    <!-- 支付方式 -->
    <view class="pay-methods">
      <view class="section-title">选择支付方式</view>

      <view
        class="method-item"
        :class="{ active: payData.payMethod === 1 }"
        @click="selectPayMethod(1)"
      >
        <image class="method-icon" src="/static/images/wechat-pay.png" />
        <text class="method-name">微信支付</text>
        <uni-icons
          v-if="payData.payMethod === 1"
          type="checkmark-filled"
          size="20"
          color="#27ba9b"
        />
      </view>

      <view
        class="method-item"
        :class="{ active: payData.payMethod === 2 }"
        @click="selectPayMethod(2)"
      >
        <image class="method-icon" src="/static/images/alipay.png" />
        <text class="method-name">支付宝</text>
        <uni-icons
          v-if="payData.payMethod === 2"
          type="checkmark-filled"
          size="20"
          color="#27ba9b"
        />
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="cancel-btn" @click="cancelOrder">取消订单</button>
      <button class="pay-btn" :disabled="paying" @click="confirmPay">
        {{ paying ? '生成支付中...' : '确认支付' }}
      </button>
    </view>

    <!-- 支付二维码弹窗 -->
    <uni-popup ref="popup" type="center" :show="showQrCode" @change="closeQrCode">
      <view class="qr-code-modal" v-if="showQrCode">
        <view class="modal-header">
          <text class="modal-title">支付宝支付</text>
          <uni-icons type="closeempty" size="24" color="#999" @click="closeQrCode" />
        </view>
        <view class="qr-code-container">
          <image class="qr-code-image" :src="qrCodeUrl" mode="aspectFit" />
          <text class="qr-code-tip">请使用支付宝扫描二维码完成支付</text>
          <text class="qr-code-amount">支付金额: ¥{{ payData.amount.toFixed(2) }}</text>
        </view>
        <view class="modal-footer">
          <button class="refresh-btn" @click="confirmPay">刷新二维码</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.pay-page {
  padding-bottom: 120rpx;
  min-height: 100vh;
  background-color: #f7f7f7;

  .order-info {
    padding: 40rpx 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    text-align: center;

    .amount-label {
      display: block;
      font-size: 28rpx;
      color: #999;
      margin-bottom: 10rpx;
    }

    .amount {
      display: block;
      font-size: 56rpx;
      font-weight: bold;
      color: #e64340;
      margin-bottom: 20rpx;
    }

    .order-no {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 10rpx;
    }

    .goods-name {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      padding: 0 40rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .countdown {
      display: block;
      font-size: 26rpx;
      color: #e64340;
    }
  }

  .pay-methods {
    padding: 0 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;

    .section-title {
      height: 100rpx;
      line-height: 100rpx;
      font-size: 30rpx;
      font-weight: bold;
      border-bottom: 1rpx solid #f5f5f5;
    }

    .method-item {
      display: flex;
      align-items: center;
      height: 120rpx;
      border-bottom: 1rpx solid #f5f5f5;

      &.active {
        background-color: #f9f9f9;
      }

      .method-icon {
        width: 50rpx;
        height: 50rpx;
        margin-right: 30rpx;
      }

      .method-name {
        flex: 1;
        font-size: 30rpx;
        color: #333;
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
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 10;

    .cancel-btn {
      flex: 1;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 32rpx;
      color: #666;
      background-color: #fff;
      border-radius: 0;
    }

    .pay-btn {
      flex: 1;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 32rpx;
      color: #fff;
      background-color: #e64340;
      border-radius: 0;

      &[disabled] {
        background-color: #f8b8b7;
      }
    }
  }

  .qr-code-modal {
    width: 600rpx;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .modal-title {
        font-size: 32rpx;
        font-weight: bold;
      }
    }

    .qr-code-container {
      padding: 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .qr-code-image {
        width: 400rpx;
        height: 400rpx;
        margin-bottom: 30rpx;
      }

      .qr-code-tip {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
      }

      .qr-code-amount {
        font-size: 32rpx;
        font-weight: bold;
        color: #e64340;
      }
    }

    .modal-footer {
      padding: 30rpx;
      display: flex;
      justify-content: center;
      border-top: 1rpx solid #f5f5f5;

      .refresh-btn {
        width: 300rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        color: #666;
        background-color: #f5f5f5;
        border-radius: 40rpx;
      }
    }
  }
}
</style>
