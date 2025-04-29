<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { LoginParams } from '@/types/login'
import { useMemberStore } from '@/stores'

// 获取会员仓库
const memberStore = useMemberStore()

// 表单数据
const form = ref<LoginParams>({
  account: '',
  password: '',
})

// 表单校验规则
const rules = {
  account: [
    { required: true, message: '请输入学号/工号', trigger: 'blur' },
    { pattern: /^\d{6,12}$/, message: '学号/工号为6-12位数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' },
  ],
}

// 登录方式切换
const loginMethod = ref<'password' | 'code'>('password')

// 是否同意协议
const agree = ref(false)

// 登录函数
const onSubmit = async () => {
  if (!agree.value) {
    return uni.showToast({ title: '请先同意用户协议', icon: 'none' })
  }

  try {
    // 调用登录接口
    await memberStore.login(form.value)
    // 登录成功后跳转回原页面或首页
    uni.switchTab({ url: '/pages/index/index' })
    uni.showToast({ title: '登录成功' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  }
}

// 跳转到注册页面
const toRegister = () => {
  uni.navigateTo({ url: '/pages/register/register' })
}

// 跳转到忘记密码页面
const toForget = () => {
  uni.navigateTo({ url: '/pages/forget/forget' })
}

// 页面加载时检查是否有回跳地址
onLoad((options) => {
  if (options?.redirectUrl) {
    uni.setStorageSync('redirectUrl', options.redirectUrl)
  }
})
</script>

<template>
  <view class="viewport">
    <!-- 头部背景 -->
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">校园二手交易平台</text>
    </view>

    <!-- 登录表单 -->
    <view class="form">
      <!-- 账号输入 -->
      <view class="form-item">
        <uni-icons class="icon" type="contact" size="20" color="#999" />
        <input
          v-model="form.account"
          class="input"
          type="text"
          placeholder="请输入学号/工号"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 密码输入 -->
      <view class="form-item">
        <uni-icons class="icon" type="locked" size="20" color="#999" />
        <input
          v-model="form.password"
          class="input"
          :type="loginMethod === 'password' ? 'password' : 'text'"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
        <uni-icons
          class="icon"
          :type="loginMethod === 'password' ? 'eye-slash' : 'eye'"
          size="20"
          color="#999"
          @click="loginMethod = loginMethod === 'password' ? 'code' : 'password'"
        />
      </view>

      <!-- 协议勾选 -->
      <label class="agreement">
        <radio :checked="agree" @click="agree = !agree" color="#27ba9b" />
        <text>我已阅读并同意</text>
        <text class="link">《用户协议》</text>
        <text>和</text>
        <text class="link">《隐私政策》</text>
      </label>

      <!-- 登录按钮 -->
      <button class="button" @click="onSubmit">登 录</button>

      <!-- 其他操作 -->
      <view class="actions">
        <text @click="toForget">忘记密码</text>
        <text @click="toRegister">注册账号</text>
      </view>
    </view>

    <!-- 第三方登录 -->
    <view class="oauth">
      <view class="oauth-title">
        <view class="line"></view>
        <text class="text">其他登录方式</text>
        <view class="line"></view>
      </view>
      <view class="oauth-icons">
        <button class="icon-button" open-type="getUserInfo">
          <uni-icons type="weixin" size="30" color="#07C160" />
          <text>微信</text>
        </button>
        <button class="icon-button">
          <uni-icons type="qq" size="30" color="#12B7F5" />
          <text>QQ</text>
        </button>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.viewport {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
  padding: 0 40rpx;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0 60rpx;

    .logo {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 20rpx;
    }

    .title {
      font-size: 36rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .form {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .form-item {
      display: flex;
      align-items: center;
      height: 90rpx;
      border-bottom: 1rpx solid #eee;
      margin-bottom: 40rpx;

      .icon {
        margin-right: 20rpx;
      }

      .input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
      }

      .placeholder {
        color: #ccc;
        font-size: 28rpx;
      }
    }

    .agreement {
      display: flex;
      align-items: center;
      margin: 30rpx 0;
      font-size: 24rpx;
      color: #666;

      radio {
        transform: scale(0.8);
        margin-right: 10rpx;
      }

      .link {
        color: #27ba9b;
        margin: 0 6rpx;
      }
    }

    .button {
      height: 90rpx;
      line-height: 90rpx;
      background-color: #27ba9b;
      color: #fff;
      font-size: 32rpx;
      border-radius: 45rpx;
      margin-top: 20rpx;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
      font-size: 26rpx;
      color: #666;

      text {
        &:active {
          color: #27ba9b;
        }
      }
    }
  }

  .oauth {
    .oauth-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40rpx;

      .line {
        width: 120rpx;
        height: 1rpx;
        background-color: #ddd;
      }

      .text {
        margin: 0 20rpx;
        font-size: 24rpx;
        color: #999;
      }
    }

    .oauth-icons {
      display: flex;
      justify-content: center;

      .icon-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 40rpx;
        background: none;
        border: none;
        padding: 0;

        text {
          margin-top: 10rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}
</style>
