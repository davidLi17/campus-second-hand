<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()
console.log('LHG:my/my.vue  memberStore:::', memberStore)

// 功能菜单项
const menus = ref([
  { icon: 'shop', name: '我的商品', url: '/pages-sub/my/goods?type=published' },
  // { icon: 'cart', name: '我卖出的', url: '/pages-sub/my/goods?type=sold' },
  { icon: 'cart', name: '我的订单', url: '/pages/order/list' },
  // { icon: 'heart', name: '我的收藏', url: '/pages-sub/my/favorites' },
  { icon: 'cart', name: '购物车', url: '/pages-sub/my/cart' },
  { icon: 'chat', name: '我的消息', url: '/pages/message/message' },
  { icon: 'location', name: '收货地址', url: '/pages-sub/my/address' },
  // { icon: 'settings', name: '账号设置', url: '/pages-sub/my/settings' },
  { icon: 'help', name: '帮助中心', url: '/pages-sub/my/help' },
])

// 页面显示时刷新用户信息
onShow(() => {
  if (memberStore.isLogin) {
    memberStore.getProfile()
  }
})

// 跳转到登录页
const toLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}

// 跳转到编辑资料页
const toEditProfile = () => {
  if (!memberStore.isLogin) return toLogin()
  uni.navigateTo({ url: '/pages-sub/my/edit-profile' })
}

// 处理菜单点击
const handleMenuClick = (url: string) => {
  // 消息页面是tabBar页面，使用switchTab
  if (url === '/pages/message/message') {
    uni.switchTab({ url })
    return
  }

  // 其他页面需要登录
  if (!memberStore.isLogin) return toLogin()
  uni.navigateTo({ url })
}
</script>

<template>
  <view class="viewport">
    <!-- 用户信息区域 -->
    <view class="profile-section" @click="toEditProfile">
      <view class="avatar-wrapper">
        <image
          class="avatar"
          :src="memberStore.profile?.userPic || '/static/images/default-avatar.png'"
          mode="aspectFill"
        />
        <text class="update-text">点击修改</text>
      </view>

      <view class="info" v-if="memberStore.isLogin">
        <text class="nickname">{{ memberStore.profile?.nickname || '未设置昵称' }}</text>
        <text class="account">学号: {{ memberStore.profile?.username || '未设置学号' }}</text>
        <text class="school">{{ memberStore.profile?.phone || '未设置手机号' }}</text>
      </view>

      <view class="login-btn" v-else>
        <button class="button" @click="toLogin">登录/注册</button>
      </view>
    </view>

    <!-- 数据统计区域 -->
    <!-- <view class="stats-section" v-if="memberStore.isLogin">
      <view class="stat-item">
        <text class="number">24</text>
        <text class="label">在售商品</text>
      </view>
      <view class="stat-item">
        <text class="number">18</text>
        <text class="label">已售出</text>
      </view>
      <view class="stat-item">
        <text class="number">96%</text>
        <text class="label">好评率</text>
      </view>
      <view class="stat-item">
        <text class="number">{{ memberStore.profile?.creditScore || 100 }}</text>
        <text class="label">信用分</text>
      </view>
    </view> -->

    <!-- 功能菜单区域 -->
    <view class="menu-section">
      <view
        class="menu-item"
        v-for="item in menus"
        :key="item.name"
        @click="handleMenuClick(item.url)"
      >
        <uni-icons class="icon" :type="item.icon" size="20" color="#666" />
        <text class="name">{{ item.name }}</text>
        <uni-icons class="arrow" type="arrowright" size="16" color="#999" />
        <!-- <text class="badge" v-if="item.badge">{{ item.badge }}</text> -->
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-section" v-if="memberStore.isLogin">
      <button class="logout-btn" @click="memberStore.logout">退出登录</button>
    </view>
  </view>
</template>

<style lang="scss">
.viewport {
  padding-bottom: 40rpx;
  background-color: #f7f7f7;
  min-height: 100vh;

  // 用户信息区域
  .profile-section {
    display: flex;
    align-items: center;
    padding: 40rpx 30rpx;
    background-color: #27ba9b;
    color: #fff;

    .avatar-wrapper {
      position: relative;
      margin-right: 30rpx;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
        background-color: #fff;
      }

      .update-text {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        font-size: 20rpx;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
      }
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .nickname {
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
      }

      .account,
      .school {
        font-size: 24rpx;
        opacity: 0.9;
        margin-bottom: 4rpx;
      }
    }

    .login-btn {
      flex: 1;

      .button {
        height: 70rpx;
        line-height: 70rpx;
        background-color: #fff;
        color: #27ba9b;
        font-size: 28rpx;
        border-radius: 35rpx;
      }
    }
  }

  // 数据统计区域
  .stats-section {
    display: flex;
    justify-content: space-around;
    padding: 30rpx 0;
    margin: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .number {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }

      .label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  // 功能菜单区域
  .menu-section {
    margin: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .menu-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      position: relative;

      & + .menu-item {
        border-top: 1rpx solid #f5f5f5;
      }

      .icon {
        margin-right: 20rpx;
      }

      .name {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .arrow {
        margin-left: 20rpx;
      }

      .badge {
        position: absolute;
        right: 70rpx;
        top: 50%;
        transform: translateY(-50%);
        background-color: #ff5c5c;
        color: #fff;
        font-size: 20rpx;
        min-width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        border-radius: 18rpx;
        padding: 0 10rpx;
      }
    }
  }

  // 退出登录按钮
  .logout-section {
    margin: 40rpx 30rpx 0;

    .logout-btn {
      height: 80rpx;
      line-height: 80rpx;
      background-color: #fff;
      color: #ff5c5c;
      font-size: 30rpx;
      border-radius: 40rpx;
      border: none;

      &::after {
        border: none;
      }
    }
  }
}
</style>
