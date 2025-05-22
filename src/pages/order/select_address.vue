<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, onMounted, onUnmounted } from 'vue'
import { addressApi } from '@/api/address'

// 地址列表
const addressList = ref<any[]>([])
const loading = ref(false)
const fromPage = ref('') // 来源页面，用于返回时判断

// 页面加载
onLoad(async (query) => {
  if (query.from) {
    fromPage.value = query.from
  }

  await loadAddressList()
})

// 加载地址列表
const loadAddressList = async () => {
  try {
    loading.value = true
    const res = await addressApi.getAllAddresses()
    console.log(res)

    addressList.value = res.data
  } catch (error) {
    console.error('加载地址失败:', error)
    uni.showToast({ title: '加载地址失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 选择地址
// 选择地址方法（100%可靠版）
const selectAddress = (address: any) => {
  if (!address) return

  // 三重传参保障：
  // 1. 写入本地存储（最可靠）
  uni.setStorageSync('SELECTED_ADDRESS', address)

  // 2. 全局事件（即时通信）
  uni.$emit('addressSelected', address)

  // 3. 返回前修改页面参数（兼容H5）
  const pages = getCurrentPages()
  if (pages.length > 1) {
    const prevPage = pages[pages.length - 2]
    // 安全访问页面实例
    if (prevPage?.$vm?.$scope?.options) {
      prevPage.$vm.$scope.options.selectedAddress = JSON.stringify(address)
    }
  }

  // 返回订单页（添加延迟确保数据传递）
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}

// 跳转到地址编辑页
const toEditAddress = (address?: any) => {
  if (address) {
    uni.navigateTo({
      url: `/pages-sub/my/address_edit?id=${address.id}`,
    })
  } else {
    uni.navigateTo({
      url: '/pages-sub/my/address_edit',
    })
  }
}

// 设置默认地址
const setDefaultAddress = async (address: any) => {
  try {
    await addressApi.updateAddress({
      ...address,
      isDefault: 1,
    })

    // 重新加载列表
    await loadAddressList()
    uni.showToast({ title: '设置默认成功', icon: 'success' })
  } catch (error) {
    console.error('设置默认地址失败:', error)
    uni.showToast({ title: '设置默认失败', icon: 'none' })
  }
}
</script>

<template>
  <view class="address-select-page">
    <!-- 加载状态 -->
    <uni-load-more v-if="loading" status="loading" />

    <!-- 地址列表 -->
    <scroll-view v-else scroll-y class="address-list">
      <!-- 地址项 -->
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
        <view class="address-actions">
          <uni-icons type="compose" size="20" color="#999" @click.stop="toEditAddress(item)" />
          <uni-icons
            v-if="item.isDefault !== 1"
            type="star-filled"
            size="20"
            color="#999"
            @click.stop="setDefaultAddress(item)"
          />
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && addressList.length === 0" class="empty">
        <image class="empty-icon" src="/static/images/empty-address.png" />
        <text class="empty-text">暂无收货地址</text>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="action-bar">
      <button class="add-btn" @click="toEditAddress()">
        <uni-icons type="plusempty" size="20" color="#fff" />
        <text>新增收货地址</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.address-select-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .address-list {
    flex: 1;
    padding: 20rpx;

    .address-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;

      .address-info {
        flex: 1;

        .address-header {
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;

          .consignee {
            font-size: 32rpx;
            font-weight: bold;
            margin-right: 20rpx;
          }

          .phone {
            font-size: 28rpx;
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
          font-size: 28rpx;
          color: #666;
          line-height: 1.4;
        }
      }

      .address-actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100rpx;
        padding-left: 30rpx;

        uni-icons {
          padding: 10rpx;
        }
      }
    }

    .empty {
      padding-top: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .empty-icon {
        width: 300rpx;
        height: 300rpx;
        margin-bottom: 30rpx;
      }

      .empty-text {
        font-size: 28rpx;
        color: #999;
      }
    }
  }

  .action-bar {
    height: 120rpx;
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .add-btn {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      uni-icons {
        margin-right: 10rpx;
      }
    }
  }
}
</style>
