<script setup lang="ts">
import { ref } from 'vue'
// 假数据
const categories = ref([
  { id: 1, name: '教材书籍', icon: 'phone' },
  { id: 2, name: '数码电子', icon: 'phone' },
  { id: 3, name: '生活用品', icon: 'phone' },
  { id: 4, name: '服饰鞋包', icon: 'phone' },
  { id: 5, name: '运动器材', icon: 'phone' },
  { id: 6, name: '其他', icon: 'more' },
])

const gotoCategory = (id: number) => {
  uni.navigateTo({
    url: `/pages/category/category_detail?id=${id}`,
  })
}
</script>

<template>
  <view class="categories">
    <view
      class="category-item"
      v-for="item in categories"
      :key="item.id"
      @click="gotoCategory(item.id)"
    >
      <uni-icons class="icon" :type="item.icon" size="30" color="#27ba9b" />
      <text class="name">{{ item.name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  margin: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx 0;

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    padding: 20rpx 0;

    .icon {
      margin-bottom: 10rpx;
    }

    .name {
      font-size: 24rpx;
      color: #666;
    }
  }
}
</style>
