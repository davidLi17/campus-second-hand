<template>
  <div class="qiugou-container">
    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading && goodsList.length === 0">
      <uni-load-more
        status="loading"
        content-text="{ contentText: { contentdown: '下拉刷新', contentrefresh: '正在刷新...', contentnomore: '没有更多数据了' } }"
      ></uni-load-more>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list" v-if="goodsList.length > 0">
      <view
        v-for="item in goodsList"
        :key="item.id"
        class="goods-item"
        @click="navigateToDetail(item.id)"
      >
        <image class="goods-image" :src="item.image" mode="aspectFill"></image>
        <view class="goods-info">
          <view class="goods-desc">{{ item.desc }}</view>
          <view class="goods-price">¥{{ item.price }}</view>
          <view class="user-info">
            <image class="user-avatar" :src="item.image"></image>
            <text class="user-name">{{ item.name }}</text>
            <view class="like-count">
              <text class="iconfont icon-like"></text>
              <text>{{ Math.floor(item.transaction / 10) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-info" v-else-if="!loading">
      <image
        class="empty-img"
        src="https://cdn.jsdelivr.net/gh/xiangyuecn/areaicon/empty-box.svg"
        mode="widthFix"
      ></image>
      <text class="empty-text">暂无求购信息</text>
      <text class="empty-tip">下拉可以刷新数据</text>
    </view>

    <!-- 发布求购按钮 -->
    <view class="add-request-btn" @click="navigateToRequest">
      <text>发布求购</text>
    </view>
  </div>
</template>

<script lang="ts" setup>
import type Api from '@/types/index.d.ts'
import { PurchaseGoodsGetAll } from '@/services/services.ts'
import { responseCode } from '@/types/schema.d'
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onShow } from '@dcloudio/uni-app'

const navigateToRequest = () => {
  uni.navigateTo({
    url: '/pages/request/request',
  })
}
const navigateToDetail = (id: number | undefined) => {
  if (!id) {
    uni.showToast({
      title: '商品ID无效',
      icon: 'none',
    })
    return
  }
  uni.navigateTo({
    url: `/pages/qiugou/qiugou-detail?id=${id}`,
  })
}

const goodsList = ref<Api.Paths.AGetPurchase.Response['data']>([])
const loading = ref(false)

async function fetchGoodsList() {
  try {
    loading.value = true
    const response = await PurchaseGoodsGetAll()
    if (response.code === responseCode.SUCCESS) {
      goodsList.value = response.data
    } else {
      uni.showToast({
        title: '获取商品列表失败',
        icon: 'none',
      })
      goodsList.value = [
        {
          id: 3,
          userId: 1003,
          name: '陈雨浩',
          desc: '运动款蓝牙耳机，降噪功能，续航12小时',
          price: 599.0,
          sort: 15,
          count: 50,
          status: 0,
          transaction: 300,
          image: 'https://example.com/image3.jpg',
          createTime: 1695811200000,
          updateTime: 1695811200000,
        },
      ]
    }
  } catch (error) {
    console.error('获取求购列表失败:', error)
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 下拉刷新处理
onPullDownRefresh(async () => {
  try {
    await fetchGoodsList()
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500,
    })
  } catch (error) {
    uni.showToast({
      title: '刷新失败',
      icon: 'none',
    })
  } finally {
    // 停止下拉刷新动画
    uni.stopPullDownRefresh()
  }
})

onShow(() => {
  fetchGoodsList()
})
</script>

<style lang="scss">
.qiugou-container {
  padding: 10px;
  background-color: #f7f7f7;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 40px 0;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 80px; /* 为底部按钮留出空间 */
}

.goods-item {
  width: 48%;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.goods-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.goods-info {
  padding: 8px 10px;
}

.goods-desc {
  font-size: 14px;
  line-height: 1.3;
  max-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.goods-price {
  font-size: 18px;
  font-weight: bold;
  color: #f04142;
  margin: 5px 0;
}

.user-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
}

.user-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.like-count {
  display: flex;
  align-items: center;
}

.icon-like {
  margin-right: 3px;
}

.add-request-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff6e30;
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 110, 48, 0.5);
  z-index: 100;
  font-size: 16px;
}

.icon-add {
  margin-right: 5px;
}

/* 补充一些字体图标样式，实际项目中需要引入相应的字体文件 */
.iconfont {
  font-family: 'iconfont';
}
.icon-add:before {
  content: '\e6df';
}
.icon-like:before {
  content: '\e8c3';
}

.empty-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #bbb;
  font-size: 16px;
  padding-top: 60px;
}
.empty-img {
  width: 120px;
  height: 120px;
  margin-bottom: 18px;
  opacity: 0.7;
}
.empty-text {
  font-size: 16px;
  color: #bbb;
  margin-top: 6px;
  letter-spacing: 1px;
}
.empty-tip {
  font-size: 14px;
  color: #bbb;
  margin-top: 6px;
  letter-spacing: 1px;
}
</style>
