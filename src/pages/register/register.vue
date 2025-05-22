<!-- src/pages/register/register.vue -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { registerApi } from '@/api/auth'
import { sendEmailApi } from '@/api/email'
import type { RegisterParams } from '@/api/auth'

// 表单数据
const form = ref<RegisterParams>({
  username: '',
  email: '',
  password: '',
  code: '',
})

const confirmPassword = ref('')
const agree = ref(false)
const loading = ref(false)
const codeLoading = ref(false)
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout | null>(null)

const onSubmit = async () => {
  if (!agree.value) {
    return uni.showToast({ title: '请先同意用户协议', icon: 'none' })
  }

  if (!form.value.username || !form.value.password || !confirmPassword.value || !form.value.code) {
    return uni.showToast({ title: '请填写完整信息', icon: 'none' })
  }

  if (form.value.password !== confirmPassword.value) {
    return uni.showToast({ title: '两次密码不一致', icon: 'none' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    return uni.showToast({ title: '请输入有效的邮箱地址', icon: 'none' })
  }

  try {
    loading.value = true
    const res = await registerApi(form.value)

    if (res.code === 0) {
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    } else {
      throw new Error(res.message || '注册失败')
    }
  } catch (error: any) {
    uni.showToast({ title: error.message || '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const getVerificationCode = async () => {
  if (!form.value.email) {
    return uni.showToast({ title: '请输入邮箱地址', icon: 'none' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    return uni.showToast({ title: '请输入有效的邮箱地址', icon: 'none' })
  }

  console.log('正在发送验证码...')

  try {
    codeLoading.value = true
    const res = await sendEmailApi({ email: form.value.email })

    if (res.code === 0) {
      uni.showToast({ title: '验证码已发送', icon: 'success' })
      startCountdown()
    } else {
      throw new Error(res.message || '发送验证码失败')
    }
  } catch (error: any) {
    uni.showToast({ title: error.message || '发送验证码失败', icon: 'none' })
  } finally {
    codeLoading.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer.value) {
      clearInterval(countdownTimer.value)
      countdownTimer.value = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})

const toLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<template>
  <view class="viewport">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">用户注册</text>
    </view>

    <view class="form">
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

      <view class="form-item">
        <uni-icons class="icon" type="compose" size="20" color="#999" />
        <input
          v-model="form.code"
          class="input"
          type="text"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
        />
        <button
          class="code-btn"
          size="mini"
          @tab="getVerificationCode"
          :disabled="countdown > 0 || codeLoading"
        >
          <template v-if="codeLoading">发送中...</template>
          <template v-else-if="countdown > 0">{{ countdown }}s后重试</template>
          <template v-else>获取验证码</template>
        </button>
      </view>

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

      <view class="form-item">
        <uni-icons class="icon" type="locked" size="20" color="#999" />
        <input
          v-model="confirmPassword"
          class="input"
          type="password"
          placeholder="请再次输入密码"
          placeholder-class="placeholder"
        />
      </view>

      <label class="agreement">
        <radio :checked="agree" @click="agree = !agree" color="#27ba9b" />
        <text>我已阅读并同意</text>
        <text class="link">《用户协议》</text>
        <text>和</text>
        <text class="link">《隐私政策》</text>
      </label>

      <button class="button" @click="onSubmit" :loading="loading" :disabled="loading">
        {{ loading ? '注册中...' : '注 册' }}
      </button>

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
      position: relative;

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

      .code-btn {
        position: absolute;
        right: 0;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        color: #27ba9b;
        background-color: #f0f9f7;
        border: none;
        border-radius: 30rpx;

        &[disabled] {
          color: #999;
          background-color: #f5f5f5;
        }
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
