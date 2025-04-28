<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 地址列表数据
const addressList = ref<
  Array<{
    id: number
    userId: number
    consignee: string
    phone: string
    provinceName: string
    cityName: string
    districtName: string
    detail: string
    isDefault: number
    label: string
  }>
>([])

// 获取地址列表
const fetchAddressList = async () => {
  try {
    // 这里应该是调用API获取地址数据
    // const res = await getAddressListAPI()
    // addressList.value = res.data

    // 模拟数据
    addressList.value = [
      {
        id: 1,
        userId: 1001,
        consignee: '张三',
        phone: '13800138000',
        provinceName: '北京市',
        cityName: '北京市',
        districtName: '朝阳区',
        detail: '建国路88号SOHO现代城A座',
        isDefault: 1,
        label: '公司',
      },
      {
        id: 2,
        userId: 1001,
        consignee: '张三',
        phone: '13800138001',
        provinceName: '上海市',
        cityName: '上海市',
        districtName: '浦东新区',
        detail: '陆家嘴环路1000号',
        isDefault: 0,
        label: '家',
      },
      {
        id: 3,
        userId: 1001,
        consignee: '李四',
        phone: '13800138002',
        provinceName: '广东省',
        cityName: '深圳市',
        districtName: '南山区',
        detail: '科技园南区1001号',
        isDefault: 0,
        label: '学校',
      },
    ]
  } catch (error) {
    uni.showToast({
      title: '获取地址失败',
      icon: 'none',
    })
  }
}

// 页面加载
onLoad(() => {
  fetchAddressList()
})

// 设置默认地址
const setDefaultAddress = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要设为默认地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 这里应该调用API设置默认地址
        // setDefaultAddressAPI(id)

        addressList.value.forEach((item) => {
          item.isDefault = item.id === id ? 1 : 0
        })

        uni.showToast({
          title: '设置成功',
          icon: 'success',
        })
      }
    },
  })
}

// 删除地址
const deleteAddress = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 这里应该调用API删除地址
        // deleteAddressAPI(id)

        addressList.value = addressList.value.filter((item) => item.id !== id)

        uni.showToast({
          title: '删除成功',
          icon: 'success',
        })
      }
    },
  })
}

// 编辑地址
const editAddress = (id: number) => {
  uni.navigateTo({
    url: `/pages-sub/my/address_edit?id=${id}`,
  })
}

// 新增地址
const addAddress = () => {
  uni.navigateTo({
    url: '/pages/address/edit',
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="address-page">
    <!-- 地址列表 -->
    <scroll-view scroll-y class="address-list">
      <view
        class="address-item"
        v-for="item in addressList"
        :key="item.id"
        :class="{ default: item.isDefault === 1 }"
      >
        <!-- 地址标签 -->
        <view class="address-label" v-if="item.label">
          <text>{{ item.label }}</text>
        </view>

        <!-- 地址信息 -->
        <view class="address-info">
          <view class="address-header">
            <text class="consignee">{{ item.consignee }}</text>
            <text class="phone">{{ item.phone }}</text>
            <text class="default-tag" v-if="item.isDefault === 1">默认</text>
          </view>

          <view class="address-detail">
            {{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}{{ item.detail }}
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="address-actions">
          <view class="action-btn" @click="editAddress(item.id)">
            <uni-icons type="compose" size="20" color="#666" />
            <text>编辑</text>
          </view>
          <view class="action-btn" @click="deleteAddress(item.id)">
            <uni-icons type="trash" size="20" color="#666" />
            <text>删除</text>
          </view>
          <view class="action-btn" @click="setDefaultAddress(item.id)" v-if="item.isDefault === 0">
            <uni-icons type="checkmarkempty" size="20" color="#666" />
            <text>设为默认</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="addressList.length === 0">
        <image class="empty-image" src="/static/images/empty-address.png" />
        <text class="empty-text">暂无收货地址</text>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="action-bar">
      <button class="add-btn" @click="addAddress">
        <uni-icons type="plusempty" size="20" color="#fff" />
        <text>新增收货地址</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.address-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .address-list {
    flex: 1;
    padding-bottom: 100rpx;

    .address-item {
      margin: 20rpx;
      padding: 30rpx;
      background-color: #fff;
      border-radius: 16rpx;
      position: relative;
      border-left: 6rpx solid transparent;

      &.default {
        border-left-color: #27ba9b;
      }

      .address-label {
        position: absolute;
        top: 0;
        right: 30rpx;
        background-color: #27ba9b;
        color: #fff;
        padding: 4rpx 12rpx;
        border-bottom-left-radius: 8rpx;
        border-bottom-right-radius: 8rpx;
        font-size: 22rpx;
      }

      .address-info {
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
            border-radius: 20rpx;
            font-size: 22rpx;
          }
        }

        .address-detail {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
      }

      .address-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 30rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #f5f5f5;

        .action-btn {
          display: flex;
          align-items: center;
          margin-left: 30rpx;
          font-size: 26rpx;
          color: #666;

          uni-icons {
            margin-right: 8rpx;
          }
        }
      }
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 100rpx;

      .empty-image {
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
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    padding: 0 20rpx;

    .add-btn {
      flex: 1;
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
