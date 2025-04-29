<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 商品详情数据
const goodsDetail = ref({
  id: 1,
  name: 'iPhone 13 Pro 256GB',
  desc: '99新，国行在保至2024年3月，无划痕无磕碰，全套包装配件齐全',
  price: 4999,
  originalPrice: 8799,
  images: [
    'https://imgservice.suning.cn/uimg1/b2c/image/iphone13-pro.jpg',
    'https://imgservice.suning.cn/uimg1/b2c/image/iphone13-pro-back.jpg',
    'https://imgservice.suning.cn/uimg1/b2c/image/iphone13-pro-detail.jpg',
  ],
  seller: {
    id: 1001,
    name: '张三',
    avatar: 'https://imgservice.suning.cn/uimg1/b2c/image/avatar.jpg',
    rating: 4.8,
    sales: 128,
  },
  stock: 5,
  specs: [
    { name: '颜色', value: '远峰蓝' },
    { name: '内存', value: '256GB' },
    { name: '版本', value: '国行' },
  ],
  status: 0, // 0-在售 1-已售 2-下架
})

// 选择的数量
const quantity = ref(1)
// 选择的规格
const selectedSpecs = ref({})

// 页面加载时获取参数
onLoad((options) => {
  console.log('商品ID:', options.id)
  // 这里应该调用API获取商品详情
  // fetchGoodsDetail(options.id)

  // 设置页面标题
  uni.setNavigationBarTitle({
    title: goodsDetail.value.name,
  })
})

// 数量增减
const changeQuantity = (type: 'add' | 'minus') => {
  if (type === 'add' && quantity.value < goodsDetail.value.stock) {
    quantity.value++
  } else if (type === 'minus' && quantity.value > 1) {
    quantity.value--
  }
}

// 加入购物车
const addToCart = () => {
  uni.showToast({
    title: '已加入购物车',
    icon: 'success',
  })

  // 这里应该调用加入购物车API
  // addToCartAPI({
  //   goodsId: goodsDetail.value.id,
  //   quantity: quantity.value,
  //   specs: selectedSpecs.value
  // })

  // 跳转到购物车页面
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/cart/cart',
    })
  }, 1500)
}

// 立即购买
const buyNow = () => {
  // 跳转到确认订单页面，携带商品信息
  uni.navigateTo({
    url: `/pages/order/confirm?goodsId=${goodsDetail.value.id}&quantity=${quantity.value}`,
  })
}

// 联系卖家
const contactSeller = () => {
  uni.makePhoneCall({
    phoneNumber: '13800138000', // 实际应该用seller.phone
  })
}
</script>

<template>
  <view class="detail-page">
    <!-- 商品图片轮播 -->
    <swiper class="swiper" autoplay circular>
      <swiper-item v-for="(img, index) in goodsDetail.images" :key="index">
        <image class="swiper-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 商品基本信息 -->
    <view class="goods-info">
      <view class="price-section">
        <text class="current-price">¥{{ goodsDetail.price }}</text>
        <text class="original-price">¥{{ goodsDetail.originalPrice }}</text>
      </view>
      <text class="title">{{ goodsDetail.name }}</text>
      <text class="desc">{{ goodsDetail.desc }}</text>

      <view class="meta">
        <view class="meta-item">
          <uni-icons type="star-filled" size="16" color="#ffb400" />
          <text>4.9分</text>
        </view>
        <view class="meta-item">
          <uni-icons type="cart-filled" size="16" color="#666" />
          <text>已售{{ goodsDetail.seller.sales }}</text>
        </view>
        <view class="meta-item">
          <uni-icons type="location-filled" size="16" color="#666" />
          <text>北京</text>
        </view>
      </view>
    </view>

    <!-- 商品规格选择 -->
    <view class="spec-section">
      <text class="section-title">规格选择</text>
      <view class="spec-list">
        <view class="spec-item" v-for="spec in goodsDetail.specs" :key="spec.name">
          <text class="spec-name">{{ spec.name }}：</text>
          <text class="spec-value">{{ spec.value }}</text>
        </view>
      </view>
    </view>

    <!-- 卖家信息 -->
    <view class="seller-info">
      <image class="avatar" :src="goodsDetail.seller.avatar" />
      <view class="info">
        <text class="name">{{ goodsDetail.seller.name }}</text>
        <view class="rating">
          <uni-rate :value="goodsDetail.seller.rating" :size="14" readonly />
          <text>{{ goodsDetail.seller.rating }}</text>
        </view>
      </view>
      <button class="contact-btn" @click="contactSeller">联系卖家</button>
    </view>

    <!-- 商品详情 -->
    <view class="detail-section">
      <text class="section-title">商品详情</text>
      <rich-text :nodes="goodsDetail.desc"></rich-text>
      <image
        v-for="(img, index) in goodsDetail.images"
        :key="'detail-' + index"
        :src="img"
        mode="widthFix"
      />
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="action-btn cart" @click="addToCart">
        <uni-icons type="cart" size="20" color="#fff" />
        <text>加入购物车</text>
      </button>
      <button class="action-btn buy" @click="buyNow">立即购买</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.detail-page {
  padding-bottom: 120rpx;

  .swiper {
    height: 750rpx;

    .swiper-image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info {
    padding: 30rpx;
    background-color: #fff;

    .price-section {
      display: flex;
      align-items: baseline;
      margin-bottom: 20rpx;

      .current-price {
        font-size: 48rpx;
        color: #ff5c5c;
        font-weight: bold;
      }

      .original-price {
        font-size: 28rpx;
        color: #999;
        text-decoration: line-through;
        margin-left: 10rpx;
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

        uni-icons {
          margin-right: 8rpx;
        }
      }
    }
  }

  .spec-section,
  .detail-section {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #fff;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }

    .spec-list {
      .spec-item {
        display: flex;
        padding: 15rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        .spec-name {
          width: 120rpx;
          color: #999;
        }

        .spec-value {
          flex: 1;
          color: #333;
        }
      }
    }

    image {
      width: 100%;
      margin-top: 20rpx;
    }
  }

  .seller-info {
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin-top: 20rpx;
    background-color: #fff;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .info {
      flex: 1;

      .name {
        font-size: 28rpx;
        font-weight: bold;
        display: block;
        margin-bottom: 8rpx;
      }

      .rating {
        display: flex;
        align-items: center;

        uni-rate {
          margin-right: 10rpx;
        }
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

    .action-btn {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      color: #fff;
      border-radius: 0;

      &.cart {
        background-color: #ffbb33;
      }

      &.buy {
        background-color: #27ba9b;
      }

      text {
        margin-left: 10rpx;
      }
    }
  }
}
</style>
