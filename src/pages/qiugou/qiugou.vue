<template>
  <div class="qiugou-container">
    <!-- 商品列表 -->
    <view class="goods-list" v-if="goodsList.length > 0">
      <view v-for="item in goodsList" :key="item.id" class="goods-item" @click="navigateToDetail(item.id)">
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
    <view class="empty-info" v-else>
      <image
        class="empty-img"
        src="https://cdn.jsdelivr.net/gh/xiangyuecn/areaicon/empty-box.svg"
        mode="widthFix"
      ></image>
      <text class="empty-text">暂无求购信息</text>
    </view>

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
import { onLoad } from '@dcloudio/uni-app'

const navigateToRequest = () => {
  uni.navigateTo({
    url: '/pages/request/request',
  })
}
const navigateToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/qiugou/qiugou-detail?id=${id}`,
  })
}

const goodsList = ref<Api.Paths.AGetPurchase.Response['data']>([])

async function fetchGoodsList() {
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
        price: 599.0, // 整数价格，适合数码产品
        sort: 15, // 排序中等
        count: 50, // 库存较低，模拟缺货预警
        status: 0, // 下架状态（库存不足自动下架）
        transaction: 300, // 销量一般
        image: 'https://example.com/image3.jpg',
        createTime: 1695811200000, // 更早的创建时间
        updateTime: 1695811200000, // 未更新过
      },
      {
        id: 4,
        userId: 1004,
        name: '李诗雨',
        desc: '大容量双肩背包，防水面料，适合学生党',
        price: 159.8, // 低价商品
        sort: 20, // 排序靠后
        count: 300, // 库存充足
        status: 1, // 在售
        transaction: 500, // 中等销量
        image: 'https://example.com/image4.jpg',
        createTime: 1695964800000, // 近期创建
        updateTime: 1695964800000, // 未更新
      },
      {
        id: 5,
        userId: 1005,
        name: '王宇航',
        desc: '智能手表，血氧监测，长续航15天',
        price: 1299.99, // 高价商品
        sort: 5, // 排序靠前（主推商品）
        count: 80, // 库存中等
        status: 2, // 预售状态（新品未上架）
        transaction: 50, // 预售订单少
        image: 'https://example.com/image5.jpg',
        createTime: 1696051200000, // 未来时间（预售商品）
        updateTime: 1696051200000, // 未更新
      },
    ]
  }
}

onLoad(() => {
  fetchGoodsList()
})
</script>

<style lang="scss">
.qiugou-container {
  padding: 10px;
  background-color: #f7f7f7;
  min-height: 100vh;
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
</style>
