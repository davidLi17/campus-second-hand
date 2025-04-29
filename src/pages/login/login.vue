<!-- src/pages/login/login.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { loginAPI } from '@/api/user'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

// 登录方式
const loginType = ref<'account' | 'sms'>('account')

// 表单数据
const form = ref({
  account: '', // 用户名或邮箱
  password: '',
  type: 'account' as const,
})

// 协议同意状态
const agree = ref(false)

// 登录加载状态
const loading = ref(false)

// 切换登录方式
const toggleLoginType = () => {
  loginType.value = loginType.value === 'account' ? 'sms' : 'account'
  form.value.account = ''
  form.value.password = ''
}

// 登录函数
// 登录函数（直接调用memberStore.login）
const onSubmit = async () => {
  if (!agree.value) {
    return uni.showToast({ title: '请先同意用户协议', icon: 'none' })
  }

  if (!form.value.account) {
    const field = loginType.value === 'account' ? '用户名' : '邮箱'
    return uni.showToast({ title: `请输入${field}`, icon: 'none' })
  }

  if (!form.value.password) {
    return uni.showToast({ title: '请输入密码', icon: 'none' })
  }

  try {
    loading.value = true

    // 准备登录参数
    const params: LoginParams = {
      password: form.value.password,
      type: loginType.value,
    }

    // 根据登录方式设置不同字段
    if (loginType.value === 'account') {
      params.username = form.value.account
    } else {
      params.email = form.value.account
    }

    // 直接调用memberStore的login方法
    const res = await memberStore.login(params)

    if (res.code === 0) {
      uni.showToast({ title: '登录成功', icon: 'success' })

      // 跳转到首页或回跳页面
      const redirectUrl = uni.getStorageSync('redirectUrl') || '/pages/index/index'
      setTimeout(() => {
        uni.reLaunch({ url: redirectUrl })
      }, 1500)
    } else {
      throw new Error(res.message || '登录失败')
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
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
      <!-- 登录方式切换 -->
      <view class="login-type">
        <text
          :class="['type-item', { active: loginType === 'account' }]"
          @click="loginType = 'account'"
        >
          账号登录
        </text>
        <text :class="['type-item', { active: loginType === 'sms' }]" @click="loginType = 'sms'">
          邮箱登录
        </text>
      </view>

      <!-- 账号/邮箱输入 -->
      <view class="form-item">
        <uni-icons
          class="icon"
          :type="loginType === 'account' ? 'person' : 'email'"
          size="20"
          color="#999"
        />
        <input
          v-model="form.account"
          class="input"
          type="text"
          :placeholder="loginType === 'account' ? '请输入用户名' : '请输入邮箱'"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 密码输入 -->
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

      <!-- 协议勾选 -->
      <label class="agreement">
        <radio :checked="agree" @click="agree = !agree" color="#27ba9b" />
        <text>我已阅读并同意</text>
        <text class="link">《用户协议》</text>
        <text>和</text>
        <text class="link">《隐私政策》</text>
      </label>

      <!-- 登录按钮 -->
      <button class="button" @click="onSubmit" :loading="loading" :disabled="loading">
        {{ loading ? '登录中...' : '登 录' }}
      </button>

      <!-- 其他操作 -->
      <view class="actions">
        <text @click="toForget">忘记密码</text>
        <text @click="toRegister">注册账号</text>
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

    .login-type {
      display: flex;
      margin-bottom: 40rpx;
      border-bottom: 1rpx solid #eee;

      .type-item {
        flex: 1;
        text-align: center;
        padding: 20rpx 0;
        font-size: 30rpx;
        color: #666;
        position: relative;

        &.active {
          color: #27ba9b;
          font-weight: bold;

          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 80rpx;
            height: 4rpx;
            background-color: #27ba9b;
          }
        }
      }
    }

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

      &[disabled] {
        opacity: 0.6;
      }
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
}
</style>
