<script setup lang="ts">
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { ref, reactive, nextTick } from 'vue'
import { addressApi } from '@/api/address'
import { orderApi } from '@/api/order'
import { getGoodsDetailAPI } from '@/api/goods'

// 订单数据 - 使用reactive处理复杂对象
const orderData = reactive({
  goodsId: '',
  quantity: 1,
  goodsDetail: null as null | {
    id: number
    name: string
    price: number
    picture: string
  },
  address: null as null | {
    id: number
    consignee: string
    phone: string
    fullAddress: string
  },
  summary: {
    totalPrice: 0,
    postFee: 0,
    payAmount: 0,
    totalNum: 0,
  },
})

// 其他响应式数据
const addressList = ref<any[]>([])
const showAddressPicker = ref(false)
const loading = ref(false)

// 页面加载
onLoad(async (query) => {
  // 单次监听确保不会重复绑定
  uni.$once('addressSelected', selectAddress)
  if (!query.goodsId) {
    uni.showToast({ title: '缺少商品参数', icon: 'none' })
    uni.navigateBack()
    return
  }

  loading.value = true

  try {
    // 获取商品详情
    const goodsRes = await getGoodsDetailAPI(Number(query.goodsId))
    if (goodsRes.code === 0 && goodsRes.data) {
      Object.assign(orderData, {
        goodsDetail: {
          id: goodsRes.data.id,
          name: goodsRes.data.name,
          price: goodsRes.data.price,
          picture: goodsRes.data.picture,
        },
        goodsId: query.goodsId,
        quantity: Number(query.quantity) || 1,
      })
      calculateOrder()
    } else {
      throw new Error(goodsRes.message || '获取商品失败')
    }

    // 获取地址列表
    await loadAddressList()
  } catch (error) {
    console.error('初始化失败:', error)
    uni.showToast({ title: error.message || '初始化失败', icon: 'none' })
    uni.navigateBack()
  } finally {
    loading.value = false
  }
})

// 跳转到地址选择页
const toAddressSelect = () => {
  // 添加时间戳防止缓存
  uni.navigateTo({
    url: `/pages/order/select_address?timestamp=${Date.now()}`,
  })
}

// 选择地址方法（终极可靠版）
const selectAddress = (address: any) => {
  if (!address) {
    orderData.address = null
    return
  }

  // 深度创建新对象确保响应式
  orderData.address = {
    id: address.id,
    consignee: address.consignee,
    phone: address.phone,
    fullAddress: `${address.provinceName}${address.cityName}${address.districtName}${address.detail}`,
  }

  // 强制视图更新（解决极少数情况下的渲染问题）
  const temp = { ...orderData.address }
  orderData.address = null
  nextTick(() => {
    orderData.address = temp
  })
}

// 页面显示时检查地址（三重保障）
onShow(() => {
  // 1. 检查URL参数
  const pages = getCurrentPages()
  const currentRoute = pages[pages.length - 1]?.route
  if (currentRoute === 'pages/order/confirm') {
    // 2. 检查本地存储
    const localAddress = uni.getStorageSync('SELECTED_ADDRESS')
    if (localAddress) {
      selectAddress(localAddress)
      uni.removeStorageSync('SELECTED_ADDRESS')
    }

    // 3. 全局事件监听（最后保障）
    uni.$once('addressSelected', selectAddress)
  }
})

// 加载地址列表
const loadAddressList = async () => {
  try {
    const res = await addressApi.getAllAddresses()
    addressList.value = res.data

    // 设置默认地址
    const defaultAddress = res.data.find((a: any) => a.isDefault === 1)
    if (defaultAddress && !orderData.address) {
      selectAddress(defaultAddress)
    }
  } catch (error) {
    console.error('加载地址失败:', error)
    uni.showToast({ title: '加载地址失败', icon: 'none' })
  }
}

// 计算订单金额
const calculateOrder = () => {
  if (!orderData.goodsDetail) return

  const price = orderData.goodsDetail.price
  const quantity = orderData.quantity

  Object.assign(orderData.summary, {
    totalPrice: price * quantity,
    postFee: 10, // 固定运费
    payAmount: price * quantity + 10,
    totalNum: quantity,
  })
}

// 修改数量
const changeQuantity = (type: 'add' | 'minus') => {
  if (type === 'add') {
    orderData.quantity++
  } else if (type === 'minus' && orderData.quantity > 1) {
    orderData.quantity--
  }
  calculateOrder()
}

// 提交订单
const submitOrder = async () => {
  if (!orderData.address) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }

  if (!orderData.goodsDetail) return

  try {
    uni.showLoading({ title: '创建订单中...' })

    const res = await orderApi.createOrder({
      addressId: orderData.address.id,
      goods: orderData.goodsId,
      summary: {
        payAmount: orderData.summary.payAmount,
        postFee: orderData.summary.postFee,
        totalNum: orderData.summary.totalNum,
        totalPrice: orderData.summary.totalPrice,
      },
    })

    if (res.code === 0) {
      uni.redirectTo({
        url: `/pages/order/pay?orderId=${res.data.id}&amount=${orderData.summary.payAmount}`,
      })
    } else {
      throw new Error(res.message || '创建订单失败')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    uni.showToast({ title: error.message || '创建订单失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<template>
  <view class="confirm-page">
    <!-- 加载状态 -->
    <uni-load-more v-if="loading" status="loading" />

    <!-- 订单内容 -->
    <view v-else class="order-content">
      <!-- 收货地址 -->
      <view class="address-section" @click="toAddressSelect">
        <template v-if="orderData.address">
          <view class="address-info" :key="orderData.address.id">
            <view class="address-header">
              <text class="consignee">{{ orderData.address.consignee }}</text>
              <text class="phone">{{ orderData.address.phone }}</text>
            </view>
            <text class="address-detail">{{ orderData.address.fullAddress }}</text>
          </view>
        </template>
        <view v-else class="no-address">
          <text>请选择收货地址</text>
        </view>
        <uni-icons type="forward" size="18" color="#999" />
      </view>

      <!-- 商品信息 -->
      <view class="goods-section">
        <view class="section-title">商品信息</view>
        <view class="goods-item">
          <image class="goods-image" :src="orderData.goodsDetail?.picture" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name">{{ orderData.goodsDetail?.name }}</text>
            <text class="goods-price">¥{{ orderData.goodsDetail?.price?.toFixed(2) }}</text>
          </view>
          <view class="quantity-control">
            <uni-icons type="minus" size="20" color="#999" @click.stop="changeQuantity('minus')" />
            <text class="quantity-text">{{ orderData.quantity }}</text>
            <uni-icons type="plus" size="20" color="#999" @click.stop="changeQuantity('add')" />
          </view>
        </view>
      </view>

      <!-- 订单备注 -->
      <view class="remark-section">
        <view class="section-title">订单备注</view>
        <input
          class="remark-input"
          placeholder="选填：填写内容已告知卖家"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 订单汇总 -->
      <view class="summary-section">
        <view class="summary-item">
          <text>商品总价</text>
          <text>¥{{ orderData.summary.totalPrice.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text>运费</text>
          <text>¥{{ orderData.summary.postFee.toFixed(2) }}</text>
        </view>
        <view class="summary-item total">
          <text>应付总额</text>
          <text class="total-price">¥{{ orderData.summary.payAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="amount">
        <text>合计：</text>
        <text class="price">¥{{ orderData.summary.payAmount.toFixed(2) }}</text>
      </view>
      <button class="submit-btn" @click="submitOrder">提交订单</button>
    </view>

    <!-- 地址选择器弹窗 -->
    <uni-popup ref="addressPicker" type="bottom">
      <view class="address-picker">
        <view class="picker-header">
          <text class="picker-title">选择收货地址</text>
          <uni-icons type="closeempty" size="24" color="#999" @click="showAddressPicker = false" />
        </view>
        <scroll-view scroll-y class="address-list">
          <view
            v-for="item in addressList"
            :key="item.id"
            class="address-item"
            @click="selectAddress(item)"
          >
            <view class="address-info">
              <view class="address-header">
                <text class="consignee">{{ item.consignee }}</text>
                <text class="phone">{{ item.phone }}</text>
                <text v-if="item.isDefault === 1" class="default-tag">默认</text>
              </view>
              <text class="address-detail">
                {{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}{{ item.detail }}
              </text>
            </view>
            <uni-icons
              v-if="orderData.address?.id === item.id"
              type="checkmark-filled"
              size="20"
              color="#27ba9b"
            />
          </view>
        </scroll-view>
        <button class="add-address-btn" @click="toAddressSelect">
          <uni-icons type="plusempty" size="20" color="#fff" />
          <text>添加新地址</text>
        </button>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.confirm-page {
  padding-bottom: 100rpx;
  min-height: 100vh;
  background-color: #f7f7f7;

  .order-content {
    padding: 20rpx;
  }

  .address-section {
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .address-info {
      flex: 1;

      .address-header {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .consignee {
          font-size: 32rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }

        .phone {
          font-size: 28rpx;
          color: #666;
        }
      }

      .address-detail {
        font-size: 28rpx;
        color: #666;
        line-height: 1.4;
      }
    }

    .no-address {
      flex: 1;
      height: 120rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 28rpx;
    }
  }

  .goods-section {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .goods-item {
      display: flex;
      align-items: center;

      .goods-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }

      .goods-info {
        flex: 1;

        .goods-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 10rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .goods-price {
          font-size: 28rpx;
          color: #e64340;
          font-weight: bold;
        }
      }

      .quantity-control {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .quantity-text {
          font-size: 28rpx;
          color: #333;
          min-width: 40rpx;
          text-align: center;
        }
      }
    }
  }

  .remark-section {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .remark-input {
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #f7f7f7;
      border-radius: 8rpx;
      font-size: 28rpx;
    }

    .placeholder {
      color: #ccc;
    }
  }

  .summary-section {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      font-size: 28rpx;
      color: #666;

      &.total {
        margin-top: 30rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #f5f5f5;
        font-size: 30rpx;
        color: #333;

        .total-price {
          font-size: 32rpx;
          color: #e64340;
          font-weight: bold;
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
    align-items: center;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 10;

    .amount {
      flex: 1;
      padding-left: 30rpx;
      font-size: 28rpx;
      color: #333;

      .price {
        font-size: 32rpx;
        color: #e64340;
        font-weight: bold;
      }
    }

    .submit-btn {
      width: 300rpx;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 32rpx;
      color: #fff;
      background-color: #e64340;
      border-radius: 0;
    }
  }

  .address-picker {
    max-height: 70vh;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 30rpx;

    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .picker-title {
        font-size: 34rpx;
        font-weight: bold;
      }
    }

    .address-list {
      max-height: 50vh;
      margin-bottom: 30rpx;

      .address-item {
        display: flex;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        .address-info {
          flex: 1;

          .address-header {
            display: flex;
            align-items: center;
            margin-bottom: 10rpx;

            .consignee {
              font-size: 30rpx;
              font-weight: bold;
              margin-right: 20rpx;
            }

            .phone {
              font-size: 26rpx;
              color: #666;
            }

            .default-tag {
              margin-left: 20rpx;
              padding: 4rpx 12rpx;
              background-color: #27ba9b;
              color: #fff;
              font-size: 22rpx;
              border-radius: 20rpx;
            }
          }

          .address-detail {
            font-size: 26rpx;
            color: #666;
          }
        }
      }
    }

    .add-address-btn {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10rpx;
    }
  }
}
</style>
