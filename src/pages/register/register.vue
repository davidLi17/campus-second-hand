<!-- <script setup lang="ts">
import { ref } from 'vue'
import type { RegisterParams } from '@/types/login'
import { registerAPI } from '@/api/member'

const form = ref<RegisterParams>({
  account: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  studentId: '',
  schoolId: 0,
  verificationCode: '',
})

const onSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    return uni.showToast({ title: '两次密码不一致', icon: 'none' })
  }

  try {
    await registerAPI(form.value)
    uni.showToast({ title: '注册成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({ title: error.message || '注册失败', icon: 'none' })
  }
}

const sendCode = () => {
  // 发送验证码逻辑
  uni.showToast({ title: '验证码已发送', icon: 'none' })
}
</script>

<template>
  <view class="viewport">
    <view class="header">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      <text class="title">注册账号</text>
    </view>

    <view class="form">
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
          v-model="form.confirmPassword"
          class="input"
          type="password"
          placeholder="请确认密码"
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item">
        <uni-icons class="icon" type="person" size="20" color="#999" />
        <input
          v-model="form.nickname"
          class="input"
          type="text"
          placeholder="请输入昵称"
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item">
        <uni-icons class="icon" type="compose" size="20" color="#999" />
        <input
          v-model="form.studentId"
          class="input"
          type="text"
          placeholder="请输入真实学号"
          placeholder-class="placeholder"
        />
      </view>

      <view class="form-item code-item">
        <uni-icons class="icon" type="email" size="20" color="#999" />
        <input
          v-model="form.verificationCode"
          class="input"
          type="text"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
        />
        <button class="code-button" @click="sendCode">获取验证码</button>
      </view>

      <button class="button" @click="onSubmit">注 册</button>

      <view class="login-link"> 已有账号？<text @click="uni.navigateBack()">去登录</text> </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 复用登录页样式，根据需求调整 */
.code-item {
  position: relative;

  .code-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #f5f5f5;
    color: #666;
    font-size: 24rpx;
    padding: 10rpx 20rpx;
    border-radius: 40rpx;
  }
}
</style> -->
