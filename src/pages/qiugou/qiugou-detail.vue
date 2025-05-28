<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// API 相关
import { createSessionAPI } from '@/api/chat'

// 状态管理
import { useMemberStore } from '@/stores/member'

// 服务方法 - 使用求购商品的API
import { PurchaseGoodsGetById } from '@/services/services.ts'

// 类型定义
import type Api from '@/types/index'
import { responseCode } from '@/types/schema.d'
import { CATEGORY_MAP } from '@/types/enums'

// 组件
import MessageBoard from '../goods/MessageBoard.vue'
import { handleChatSessionError } from '@/utils/helpers'

// 实例化store
const memberStore = useMemberStore()

// 求购商品详情数据
const goodsDetail = ref<{
  id: number
  name: string
  desc: string
  price: number
  image: string
  sort: number
  categoryName: string
  count: number
  userId: number
  userName: string
  status: number
  transaction: number
  createTime: number
  updateTime: number
}>()

// 加载状态
const loading = ref(false)
const error = ref(false)

// 选择的数量
const quantity = ref(1)

// 页面加载时获取参数
onLoad((options) => {
  if (options && !options.id) {
    uni.showToast({
      title: '缺少商品ID参数',
      icon: 'none',
    })
    uni.navigateBack()
    return
  }

  if (options) {
    fetchGoodsDetail(Number(options.id))
  }
})

// 获取求购商品详情
const fetchGoodsDetail = async (id: number) => {
  try {
    loading.value = true
    error.value = false

    const res = await PurchaseGoodsGetById({ id })

    if (res.code === responseCode.SUCCESS && res.data) {
      // 获取用户信息：如果是当前用户发布的求购，显示真实信息，否则显示默认信息
      const isCurrentUser = memberStore.profile?.id === res.data.userId
      const userName = isCurrentUser
        ? memberStore.profile?.nickname || memberStore.profile?.username || `用户${res.data.userId}`
        : `用户${res.data.userId}`

      // 转换数据格式以匹配详情页面的结构
      goodsDetail.value = {
        id: res.data.id!,
        name: res.data.name,
        desc: res.data.desc,
        price: res.data.price,
        image: res.data.image,
        sort: res.data.sort,
        categoryName: CATEGORY_MAP[res.data.sort as keyof typeof CATEGORY_MAP] || '未知分类',
        count: res.data.count,
        userId: res.data.userId!,
        userName: userName,
        status: res.data.status,
        transaction: res.data.transaction,
        createTime: res.data.createTime!,
        updateTime: res.data.updateTime!,
      }

      uni.setNavigationBarTitle({
        title: res.data.name,
      })
    } else {
      throw new Error(res.message || '获取求购商品详情失败')
    }
  } catch (err) {
    console.error('获取求购商品详情失败:', err)
    error.value = true
    uni.showToast({
      title: '获取求购商品详情失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 获取用户信息（预留接口，将来如果有用户详情API可以使用）
// const fetchUserInfo = async (userId: number) => {
//   try {
//     // 这里可以调用用户详情API
//     // const userRes = await getUserByIdAPI({ id: userId })
//     // if (userRes.code === responseCode.SUCCESS && goodsDetail.value) {
//     //   goodsDetail.value.userName = userRes.data.nickname || userRes.data.username
//     // }
//   } catch (error) {
//     console.log('获取用户信息失败:', error)
//   }
// }

// 数量增减
const changeQuantity = (type: 'add' | 'minus') => {
  if (type === 'add') {
    quantity.value++
  } else if (type === 'minus' && quantity.value > 1) {
    quantity.value--
  }
}

// 联系求购者
const contactBuyer = async () => {
  if (!goodsDetail.value?.userId) {
    uni.showToast({
      title: '求购者信息缺失',
      icon: 'none',
    })
    return
  }

  try {
    uni.showLoading({ title: '正在创建会话...' })

    const res = await createSessionAPI({
      toUser: goodsDetail.value.userId,
    })

    uni.hideLoading()

    if (res.code === 0) {
      // 创建会话成功，跳转到聊天详情页面
      uni.navigateTo({
        url: `/pages-sub/chat/chat-detail?sessionId=${res.data}&contactName=${goodsDetail.value.userName}&contactId=${goodsDetail.value.userId}`,
      })
    } else {
      handleChatSessionError(res)
    }
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '联系求购者失败',
      icon: 'none',
    })
  }
}

// 我有此商品 - 联系求购者
const haveThisGoods = () => {
  if (!goodsDetail.value) return

  uni.showModal({
    title: '确认联系',
    content: `您确定要联系求购者吗？求购商品：${goodsDetail.value.name}`,
    success: (res) => {
      if (res.confirm) {
        contactBuyer()
      }
    },
  })
}

// 查看分类
const viewCategory = () => {
  if (!goodsDetail.value) return

  uni.navigateTo({
    url: `/pages/category/category_detail?id=${goodsDetail.value.sort}&name=${encodeURIComponent(
      goodsDetail.value.categoryName,
    )}`,
  })
}

// 获取交易方式文本
const getTransactionText = (transaction: number) => {
  return transaction === 0 ? '线上交易' : '线下交易'
}

// 获取状态文本
const getStatusText = (status: number) => {
  return status === 1 ? '求购中' : '已结束'
}
</script>

<template>
  <view class="detail-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error">
      <image class="error-icon" src="/static/images/error.png" />
      <text class="error-text">加载失败，请重试</text>
      <button class="retry-btn" @click="fetchGoodsDetail(goodsDetail?.id || 0)">重新加载</button>
    </view>

    <!-- 求购商品详情内容 -->
    <template v-else-if="goodsDetail">
      <!-- 商品图片 -->
      <view class="image-container">
        <image class="goods-image" :src="goodsDetail.image" mode="aspectFill" />
        <view class="status-badge" :class="{ active: goodsDetail.status === 1 }">
          {{ getStatusText(goodsDetail.status) }}
        </view>
      </view>

      <!-- 商品基本信息 -->
      <view class="goods-info">
        <view class="price-section">
          <text class="current-price">¥{{ goodsDetail.price.toFixed(2) }}</text>
          <text class="count-text">需求数量：{{ goodsDetail.count }}件</text>
        </view>
        <text class="title">{{ goodsDetail.name }}</text>
        <text class="desc">{{ goodsDetail.desc }}</text>

        <view class="meta">
          <view class="meta-item" @click="viewCategory">
            <uni-icons type="shop" size="16" color="#666" />
            <text>{{ goodsDetail.categoryName }}</text>
          </view>
          <view class="meta-item">
            <uni-icons type="wallet" size="16" color="#666" />
            <text>{{ getTransactionText(goodsDetail.transaction) }}</text>
          </view>
          <view class="meta-item">
            <uni-icons type="calendar" size="16" color="#666" />
            <text>{{ new Date(goodsDetail.createTime).toLocaleDateString() }}</text>
          </view>
        </view>
      </view>

      <!-- 求购者信息 -->
      <view class="seller-info">
        <view class="info">
          <text class="name">求购者：{{ goodsDetail.userName }}</text>
          <text class="status">{{ getStatusText(goodsDetail.status) }}</text>
        </view>
        <button class="contact-btn" @click="contactBuyer" :disabled="goodsDetail.status !== 1">
          联系求购者
        </button>
      </view>

      <!-- 使用留言组件 -->
      <MessageBoard :product-id="goodsDetail.id" />

      <!-- 求购详情 -->
      <view class="detail-section">
        <text class="section-title">求购详情</text>
        <view class="detail-content">
          <view class="detail-item">
            <text class="label">商品名称：</text>
            <text class="value">{{ goodsDetail.name }}</text>
          </view>
          <view class="detail-item">
            <text class="label">期望价格：</text>
            <text class="value price">¥{{ goodsDetail.price.toFixed(2) }}</text>
          </view>
          <view class="detail-item">
            <text class="label">需求数量：</text>
            <text class="value">{{ goodsDetail.count }}件</text>
          </view>
          <view class="detail-item">
            <text class="label">交易方式：</text>
            <text class="value">{{ getTransactionText(goodsDetail.transaction) }}</text>
          </view>
          <view class="detail-item">
            <text class="label">商品分类：</text>
            <text class="value">{{ goodsDetail.categoryName }}</text>
          </view>
          <view class="detail-item">
            <text class="label">发布时间：</text>
            <text class="value">{{ new Date(goodsDetail.createTime).toLocaleString() }}</text>
          </view>
        </view>
        <view class="desc-section">
          <text class="desc-title">详细描述：</text>
          <text class="desc-text">{{ goodsDetail.desc }}</text>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="action-bar" v-if="goodsDetail.status === 1">
        <button class="action-btn primary" @click="haveThisGoods">我有此商品</button>
        <button class="action-btn secondary" @click="contactBuyer">联系求购者</button>
      </view>

      <!-- 已结束状态的底部栏 -->
      <view class="action-bar disabled" v-else>
        <text class="disabled-text">该求购已结束</text>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.detail-page {
  padding-bottom: 120rpx;
  min-height: 100vh;
  background-color: #f7f7f7;

  .loading {
    height: 500rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .error {
    height: 500rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .error-icon {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 20rpx;
    }

    .error-text {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 20rpx;
    }

    .retry-btn {
      width: 200rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 30rpx;
    }
  }

  .image-container {
    position: relative;
    height: 750rpx;
    background-color: #fff;

    .goods-image {
      width: 100%;
      height: 100%;
    }

    .status-badge {
      position: absolute;
      top: 30rpx;
      right: 30rpx;
      padding: 10rpx 20rpx;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #fff;
      background-color: #999;

      &.active {
        background-color: #ff6e30;
      }
    }
  }

  .goods-info {
    padding: 30rpx;
    margin: 20rpx 0;
    background-color: #fff;

    .price-section {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .current-price {
        font-size: 48rpx;
        color: #f03c3c;
        font-weight: bold;
      }

      .count-text {
        font-size: 28rpx;
        color: #ff6e30;
        font-weight: bold;
      }
    }

    .title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      display: block;
    }

    .desc {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 20rpx;
      display: block;
    }

    .meta {
      display: flex;
      font-size: 24rpx;
      color: #666;

      .meta-item {
        display: flex;
        align-items: center;
        margin-right: 30rpx;
        padding: 8rpx 0;

        uni-icons {
          margin-right: 8rpx;
        }
      }
    }
  }

  .seller-info {
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin: 20rpx 0;
    background-color: #fff;

    .info {
      flex: 1;

      .name {
        font-size: 28rpx;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .status {
        font-size: 24rpx;
        color: #ff6e30;
      }
    }

    .contact-btn {
      padding: 0 30rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      color: #27ba9b;
      border: 1rpx solid #27ba9b;
      border-radius: 30rpx;
      background-color: #fff;

      &[disabled] {
        color: #999;
        border-color: #ddd;
        background-color: #f5f5f5;
      }
    }
  }

  .detail-section {
    padding: 30rpx;
    background-color: #fff;
    margin: 20rpx 0;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .detail-content {
      .detail-item {
        display: flex;
        align-items: center;
        padding: 15rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .label {
          width: 160rpx;
          font-size: 28rpx;
          color: #666;
        }

        .value {
          flex: 1;
          font-size: 28rpx;
          color: #333;

          &.price {
            color: #f03c3c;
            font-weight: bold;
          }
        }
      }
    }

    .desc-section {
      margin-top: 30rpx;
      padding-top: 30rpx;
      border-top: 1rpx solid #f5f5f5;

      .desc-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        display: block;
        margin-bottom: 15rpx;
      }

      .desc-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
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
    padding: 0 30rpx;

    &.disabled {
      justify-content: center;

      .disabled-text {
        font-size: 28rpx;
        color: #999;
      }
    }

    .action-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #fff;
      border-radius: 40rpx;
      margin: 0 10rpx;
      padding: 0;

      &.primary {
        background-color: #ff6e30;
      }

      &.secondary {
        background-color: #27ba9b;
      }
    }
  }
}
</style>
