<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemberStore } from '@/stores/member'
import { updateUserAPI } from '@/api/user'

const memberStore = useMemberStore()

// 表单数据（从store中初始化）
const form = ref({
  nickname: memberStore.profile?.nickname || '',
  phone: memberStore.profile?.phone || '',
  email: memberStore.profile?.email || '',
})

// 表单验证规则
const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}

// 提交状态
const loading = ref(false)

// 提交表单
const onSubmit = async () => {
  if (!memberStore.profile?.id) return

  try {
    loading.value = true

    const res = await updateUserAPI({
      id: memberStore.profile.id,
      nickname: form.value.nickname,
      phone: form.value.phone,
      email: form.value.email,
    })

    if (res.code === 0) {
      uni.showToast({ title: '修改成功', icon: 'success' })
      // 更新store中的用户信息
      memberStore.profile = {
        ...memberStore.profile,
        ...form.value,
      }
      // 更新本地存储
      setStorage('profile', memberStore.profile)
    } else {
      throw new Error(res.message || '修改失败')
    }
  } catch (error: any) {
    uni.showToast({ title: error.message, icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="edit-profile">
    <!-- 头像上传 -->
    <view class="avatar-section">
      <image
        class="avatar"
        :src="memberStore.profile?.userPic || '/static/images/default-avatar.png'"
        mode="aspectFill"
      />
      <text class="change-text">点击修改头像</text>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <uni-forms :model="form" :rules="rules">
        <uni-forms-item label="昵称" name="nickname">
          <uni-easyinput v-model="form.nickname" placeholder="请输入昵称" />
        </uni-forms-item>

        <uni-forms-item label="手机号" name="phone">
          <uni-easyinput v-model="form.phone" placeholder="请输入手机号" />
        </uni-forms-item>

        <uni-forms-item label="邮箱" name="email">
          <uni-easyinput v-model="form.email" placeholder="请输入邮箱" />
        </uni-forms-item>
      </uni-forms>

      <button class="submit-btn" :loading="loading" @click="onSubmit">保存修改</button>
    </view>
  </view>
</template>

<style lang="scss">
.edit-profile {
  padding: 30rpx;

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 2rpx solid #eee;
    }

    .change-text {
      margin-top: 16rpx;
      font-size: 26rpx;
      color: #27ba9b;
    }
  }

  .form-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .submit-btn {
      margin-top: 40rpx;
      background-color: #27ba9b;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;

      &[disabled] {
        opacity: 0.6;
      }
    }
  }
}
</style>
