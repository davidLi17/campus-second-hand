<template>
  <view class="confirm-page">
    <view class="param-display">
      <view class="param-item">
        <text class="param-name">商品ID:</text>
        <text class="param-value">{{ goodsId }}</text>
      </view>
      <view class="param-item">
        <text class="param-name">购买数量:</text>
        <text class="param-value">{{ quantity }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 定义参数
const goodsId = ref('')
const quantity = ref(1)

// 页面加载时获取参数
onLoad((options) => {
  if (options) {
    goodsId.value = options.goodsId || ''
    quantity.value = parseInt(options.quantity) || 1
  }

  // 打印参数到控制台
  console.log('接收到的参数:', {
    goodsId: goodsId.value,
    quantity: quantity.value,
  })
})
</script>

<style lang="scss">
.confirm-page {
  padding: 30rpx;

  .param-display {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .param-item {
      display: flex;
      margin-bottom: 20rpx;
      font-size: 28rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .param-name {
        color: #666;
        width: 150rpx;
      }

      .param-value {
        color: #333;
        font-weight: bold;
      }
    }
  }
}
</style>
