<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

const params = ref({})

onLoad((options) => {
  params.value = options || {}
})
</script>

<template>
  <view class="simple-category">
    <text>分类页参数:</text>
    <text>{{ JSON.stringify(params, null, 2) }}</text>
  </view>
</template>

<style lang="scss">
.simple-category {
  padding: 30rpx;
  font-size: 28rpx;
  word-break: break-all;
}
</style>
