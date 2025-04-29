<!-- src/pages/register/register.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { registerAPI } from '@/api/user'

// 表单数据
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: '2', // 固定值，根据API要求保留
})

// 协议同意状态
const agree = ref(false)

// 注册加载状态
const loading = ref(false)

// 注册函数
const onSubmit = async () => {
  if (!agree.value) {
    return uni.showToast({ title: '请先同意用户协议', icon: 'none' })
  }

  if (form.value.password !== form.value.confirmPassword) {
    return uni.showToast({ title: '两次密码不一致', icon: 'none' })
  }

  // 简单的邮箱格式验证
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    return uni.showToast({ title: '请输入有效的邮箱地址', icon: 'none' })
  }

  try {
    loading.value = true

    const res = await registerAPI({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      type: form.value.type,
    })

    if (res.code === 0) {
      uni.showToast({ title: '注册成功' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      throw new Error(res.message || '注册失败')
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message || '注册失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const toLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<template>
  <view class="viewport">
    <!-- 头部背景 -->
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">用户注册</text>
    </view>

    <!-- 注册表单 -->
    <view class="form">
      <!-- 用户名 -->
      <view class="form-item">
        <uni-icons class="icon" type="person" size="20" color="#999" />
        <input
          v-model="form.username"
          class="input"
          type="text"
          placeholder="请输入用户名"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 邮箱 -->
      <view class="form-item">
        <uni-icons class="icon" type="email" size="20" color="#999" />
        <input
          v-model="form.email"
          class="input"
          type="text"
          placeholder="请输入邮箱"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 密码 -->
      <view class="form-item">
        <uni-icons class="icon" type="locked" size="20" color="#999" />
        <input
          v-model="form.password"
          class="input"
          type="password"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 确认密码 -->
      <view class="form-item">
        <uni-icons class="icon" type="locked" size="20" color="#999" />
        <input
          v-model="form.confirmPassword"
          class="input"
          type="password"
          placeholder="请再次输入密码"
          placeholder-class="placeholder"
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

      <!-- 注册按钮 -->
      <button class="button" @click="onSubmit" :loading="loading" :disabled="loading">
        {{ loading ? '注册中...' : '注 册' }}
      </button>

      <!-- 已有账号 -->
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @click="toLogin">去登录</text>
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
    padding: 80rpx 0 40rpx;

    .logo {
      width: 100rpx;
      height: 100rpx;
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
      margin-bottom: 30rpx;

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

      &[disabled] {
        opacity: 0.6;
      }
    }

    .login-link {
      text-align: center;
      margin-top: 30rpx;
      font-size: 26rpx;
      color: #666;

      .link {
        color: #27ba9b;
        margin-left: 10rpx;
      }
    }
  }
}
</style>
