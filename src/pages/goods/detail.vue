<!-- src/pages/goods/detail.vue -->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getGoodsDetailAPI } from '@/api/goods'

import type Api from '@/types/index'
import { ShoppingCartPostAdd } from '@/services/services.ts'
import { responseCode } from '@/types/schema.d'
import { createSessionAPI } from '@/api/chat'

// 商品详情数据
const goodsDetail = ref<{
  id: number
  name: string
  desc: string
  price: number
  picture: string
  pictures: string[]
  categoryId: number
  categoryName: string
  collectCount: number
  commentCount: number
  likeCount: number
  sellerId: number
  sellerName: string
  status: number
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

  if (options) fetchGoodsDetail(Number(options.id))
})

// 获取商品详情
const fetchGoodsDetail = async (id: number) => {
  try {
    loading.value = true
    error.value = false

    const res = await getGoodsDetailAPI(id)

    if (res.code === 0 && res.data) {
      goodsDetail.value = res.data
      uni.setNavigationBarTitle({
        title: res.data.name,
      })
    } else {
      throw new Error(res.message || '获取商品详情失败')
    }
  } catch (err) {
    console.error('获取商品详情失败:', err)
    error.value = true
    uni.showToast({
      title: '获取商品详情失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 数量增减
const changeQuantity = (type: 'add' | 'minus') => {
  if (type === 'add') {
    quantity.value++
  } else if (type === 'minus' && quantity.value > 1) {
    quantity.value--
  }
}

// 加入购物车
const addToCart = async () => {
  if (!goodsDetail.value) return

  const res = await ShoppingCartPostAdd({
    goodId: goodsDetail.value.id,
  })
  if (res.code === responseCode.SUCCESS) {
    uni.showToast({
      title: '已加入购物车',
      icon: 'success',
    })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages-sub/my/cart' })
    }, 1000)
  } else {
    uni.showToast({
      title: '加入购物车失败',
      icon: 'none',
    })
  }
}

// 立即购买
const buyNow = () => {
  if (!goodsDetail.value) return

  uni.navigateTo({
    url: `/pages/order/confirm?goodsId=${goodsDetail.value.id}&quantity=${quantity.value}`,
  })
}

// 联系卖家
const contactSeller = async () => {
  if (!goodsDetail.value?.sellerId) {
    uni.showToast({
      title: '卖家信息缺失',
      icon: 'none',
    })
    return
  }
  const res = await createSessionAPI({
    toUser: goodsDetail.value.sellerId,
  })
}

// 收藏商品
const toggleCollect = () => {
  if (!goodsDetail.value) return

  uni.showToast({
    title: goodsDetail.value.collectCount > 0 ? '已取消收藏' : '已收藏',
    icon: 'none',
  })

  // 实际项目中这里调用收藏API
  // toggleCollectAPI(goodsDetail.value.id)
}

// 查看分类
const viewCategory = () => {
  if (!goodsDetail.value) return

  uni.navigateTo({
    url: `/pages/category/detail?id=${goodsDetail.value.categoryId}&name=${encodeURIComponent(
      goodsDetail.value.categoryName,
    )}`,
  })
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

    <!-- 商品详情内容 -->
    <template v-else-if="goodsDetail">
      <!-- 商品图片轮播 -->
      <swiper class="swiper" autoplay circular>
        <swiper-item
          v-for="(img, index) in [goodsDetail.picture, ...goodsDetail.pictures]"
          :key="index"
        >
          <image class="swiper-image" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <!-- 商品基本信息 -->
      <view class="goods-info">
        <view class="price-section">
          <text class="current-price">¥{{ goodsDetail.price.toFixed(2) }}</text>
        </view>
        <text class="title">{{ goodsDetail.name }}</text>
        <text class="desc">{{ goodsDetail.desc }}</text>

        <view class="meta">
          <view class="meta-item" @click="viewCategory">
            <uni-icons type="shop" size="16" color="#666" />
            <text>{{ goodsDetail.categoryName }}</text>
          </view>
          <view class="meta-item">
            <uni-icons type="heart" size="16" color="#666" />
            <text>{{ goodsDetail.likeCount }}人喜欢</text>
          </view>
          <view class="meta-item">
            <uni-icons type="chat" size="16" color="#666" />
            <text>{{ goodsDetail.commentCount }}条评论</text>
          </view>
        </view>
      </view>

      <!-- 卖家信息 -->
      <view class="seller-info">
        <view class="info">
          <text class="name">商家：{{ goodsDetail.sellerName }}</text>
        </view>
        <button class="contact-btn" @click="contactSeller">联系卖家</button>
      </view>

      <!-- 商品详情 -->
      <view class="detail-section">
        <text class="section-title">商品详情</text>
        <rich-text :nodes="goodsDetail.desc"></rich-text>
        <image
          v-for="(img, index) in goodsDetail.pictures"
          :key="'detail-' + index"
          :src="img"
          mode="widthFix"
        />
      </view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <view class="action-icon" @click="toggleCollect">
          <uni-icons
            :type="goodsDetail.collectCount > 0 ? 'heart-filled' : 'heart'"
            size="24"
            :color="goodsDetail.collectCount > 0 ? '#f03c3c' : '#666'"
          />
          <text>收藏</text>
        </view>
        <view class="quantity-control">
          <button class="quantity-btn" @click="changeQuantity('minus')">-</button>
          <text class="quantity">{{ quantity }}</text>
          <button class="quantity-btn" @click="changeQuantity('add')">+</button>
        </view>
        <button class="action-btn cart" @click="addToCart">加入购物车</button>
        <button class="action-btn buy" @click="buyNow">立即购买</button>
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

  .swiper {
    height: 750rpx;
    background-color: #fff;

    .swiper-image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info {
    padding: 30rpx;
    margin: 20rpx 0;
    background-color: #fff;

    .price-section {
      display: flex;
      align-items: baseline;
      margin-bottom: 20rpx;

      .current-price {
        font-size: 48rpx;
        color: #f03c3c;
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
    }
  }

  .detail-section {
    padding: 30rpx;
    background-color: #fff;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    image {
      width: 100%;
      margin-top: 20rpx;
      display: block;
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

    .action-icon {
      width: 120rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      text {
        font-size: 20rpx;
        color: #666;
        margin-top: 4rpx;
      }
    }

    .quantity-control {
      display: flex;
      align-items: center;
      margin-right: 20rpx;

      .quantity-btn {
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: 32rpx;
        color: #666;
        background-color: #f7f7f7;
        border-radius: 4rpx;
        padding: 0;
      }

      .quantity {
        width: 80rpx;
        text-align: center;
        font-size: 28rpx;
      }
    }

    .action-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #fff;
      border-radius: 0;
      padding: 0;

      &.cart {
        background-color: #ff9500;
      }

      &.buy {
        background-color: #f03c3c;
      }
    }
  }
}
</style>
