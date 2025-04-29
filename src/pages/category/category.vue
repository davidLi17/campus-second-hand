<!-- src/components/GoodsList.vue -->
<script setup lang="ts">
<<<<<<< HEAD
import { onMounted, ref } from 'vue'
import { getGoodsListAPI } from '@/api/goods'

// 商品数据
const goodsData = ref<
  Array<{
    id: number
    name: string
    categoryPic: string
    goods: Array<{
      id: number
      name: string
      picture: string
      price: number
      desc: string
    }>
  }>
>([])

// 加载状态
const loading = ref(false)
const error = ref(false)

// 获取商品列表
const fetchGoodsList = async () => {
  try {
    loading.value = true
    error.value = false

    const res = await getGoodsListAPI()

    if (res.code === 0 && res.data) {
      goodsData.value = res.data
    } else {
      throw new Error(res.message || '获取商品列表失败')
    }
  } catch (err) {
    console.error('获取商品列表失败:', err)
    error.value = true
    uni.showToast({
      title: '获取商品列表失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 点击商品
const handleGoodsClick = (goodsId: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${goodsId}`,
  })
}

// 点击分类
const handleCategoryClick = (categoryId: number, categoryName: string) => {
  uni.navigateTo({
    url: `/pages/category/category_detail?id=${categoryId}&name=${encodeURIComponent(
      categoryName,
    )}`,
  })
}

// 初始化加载
onMounted(() => {
  fetchGoodsList()
})

// 重试加载
const retryFetch = () => {
  fetchGoodsList()
}
</script>

<template>
  <view class="goods-list-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error">
      <image class="error-icon" src="/static/images/error.png" />
      <text class="error-text">加载失败，请重试</text>
      <button class="retry-btn" @click="retryFetch">重新加载</button>
    </view>

    <!-- 商品列表 -->
    <template v-else>
      <view v-for="category in goodsData" :key="category.id" class="category-section">
        <!-- 分类标题 -->
        <view class="category-header" @click="handleCategoryClick(category.id, category.name)">
          <image
            class="category-image"
            :src="category.categoryPic || '/static/images/default-category.png'"
            mode="aspectFill"
          />
          <text class="category-name">{{ category.name }}</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>

        <!-- 商品列表 -->
        <scroll-view scroll-x class="goods-scroll">
          <view
            v-for="goods in category.goods"
            :key="goods.id"
            class="goods-item"
            @click="handleGoodsClick(goods.id)"
          >
            <image class="goods-image" :src="goods.picture" mode="aspectFill" />
            <text class="goods-name">{{ goods.name }}</text>
            <text class="goods-price">¥{{ goods.price.toFixed(2) }}</text>
          </view>
        </scroll-view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.goods-list-container {
  padding: 20rpx;

  .loading {
    height: 300rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .error {
    height: 300rpx;
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

  .category-section {
    margin-bottom: 40rpx;

    .category-header {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      margin-bottom: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .category-image {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .category-name {
        flex: 1;
        font-size: 32rpx;
        font-weight: bold;
      }
    }

    .goods-scroll {
      white-space: nowrap;

      .goods-item {
        display: inline-block;
        width: 220rpx;
        margin-right: 20rpx;
        background-color: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

        .goods-image {
          width: 220rpx;
          height: 220rpx;
        }

        .goods-name {
          display: block;
          padding: 10rpx;
          font-size: 26rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .goods-price {
          display: block;
          padding: 0 10rpx 10rpx;
          font-size: 28rpx;
          color: #f03c3c;
          font-weight: bold;
        }
=======
import { getBannerList } from '@/services/services'
import XtxSwiper from '@/components/XtxSwiper.vue'
import { onLoad } from '@dcloudio/uni-app'
import type Api from '@/types'
import { ref } from 'vue'
const reqParams: Api.Paths.AGetList.Request = {
  page: 1,
  pageSize: 10,
}
const bannerList = ref<Api.Schema.BannerVO[]>()
onLoad(async () => {
  // 页面加载时获取轮播图数据
  const res = await getBannerList(reqParams)
  bannerList.value = res.data.items
})
</script>

<template>
  <view class="viewport">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">女靴</text>
      </view>
    </view>

    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view v-for="(item, index) in 10" :key="item" class="item" :class="{ active: index === 0 }">
          <text class="name"> 居家 </text>
        </view>
      </scroll-view>

      <!-- 右侧：二级分类 -->
      <scroll-view class="secondary" scroll-y>
        <!-- 焦点图 -->
        <XtxSwiper class="banner" v-if="bannerList" :list="bannerList" />
        <!-- 内容区域 -->
        <view class="panel" v-for="item in 3" :key="item">
          <view class="title">
            <text class="name">宠物用品</text>

            <navigator class="more" hover-class="none">全部</navigator>
          </view>

          <view class="section">
            <navigator
              v-for="goods in 4"
              :key="goods"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=`"
            >
              <image
                class="image"
                src="https://yanxuan-item.nosdn.127.net/674ec7a88de58a026304983dd049ea69.jpg"
              ></image>

              <view class="name ellipsis">木天蓼逗猫棍</view>

              <view class="price">
                <text class="symbol">¥</text>

                <text class="number">16.00</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.search {
  padding: 0 30rpx 20rpx;
  background-color: #fff;
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding-left: 26rpx;
    color: #8b8b8b;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: #f3f4f4;
  }
}
.icon-search {
  &::before {
    margin-right: 10rpx;
  }
}
/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}
/* 一级分类 */
.primary {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }
  .active {
    background-color: #fff;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 8rpx;
      height: 100%;
      background-color: #27ba9b;
    }
  }
}
.primary .item:last-child::after,
.primary .active::after {
  display: none;
}
/* 二级分类 */
.secondary {
  background-color: #fff;
  .carousel {
    height: 200rpx;
    margin: 0 30rpx 20rpx;
    border-radius: 4rpx;
    overflow: hidden;
  }
  .panel {
    margin: 0 30rpx 0rpx;
  }
  .title {
    height: 60rpx;
    line-height: 60rpx;
    color: #333;
    font-size: 28rpx;
    border-bottom: 1rpx solid #f7f7f8;
    .more {
      float: right;
      padding-left: 20rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  .more {
    &::after {
      font-family: 'erabbit' !important;
      content: '\e6c2';
    }
  }
  .section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;
    .goods {
      width: 150rpx;
      margin: 0rpx 30rpx 20rpx 0;
      &:nth-child(3n) {
        margin-right: 0;
      }
      image {
        width: 150rpx;
        height: 150rpx;
      }
      .name {
        padding: 5rpx;
        font-size: 22rpx;
        color: #333;
      }
      .price {
        padding: 5rpx;
        font-size: 18rpx;
        color: #cf4444;
      }
      .number {
        font-size: 24rpx;
        margin-left: 2rpx;
>>>>>>> a5c23a2 (feat:)
      }
    }
  }
}
</style>
