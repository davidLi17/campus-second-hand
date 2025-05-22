<template>
  <view class="profile-edit-page">
    <!-- 顶部导航 -->
    <view class="page-header">
      <text class="header-title">个人信息</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <!-- 头像上传 -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @click="uploadAvatar">
          <image
            class="avatar"
            :src="memberStore.profile?.userPic || '/static/images/default-avatar.png'"
            mode="aspectFill"
          />
          <view v-if="loading.avatar" class="uploading-mask">
            <uni-load-more status="loading" :show-text="false" color="#fff" />
          </view>
        </view>
        <text class="avatar-tip">点击修改头像</text>
      </view>

      <!-- 基本信息表单 -->
      <view class="form-section">
        <text class="section-title">基本信息</text>

        <uni-forms ref="baseFormRef" :model="baseForm" :rules="rules">
          <uni-forms-item label="昵称" name="nickname">
            <uni-easyinput v-model="baseForm.nickname" placeholder="请输入昵称(2-12位)" trim />
          </uni-forms-item>

          <uni-forms-item label="手机号" name="phone">
            <uni-easyinput
              v-model="baseForm.phone"
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
            />
          </uni-forms-item>

          <uni-forms-item label="邮箱" name="email">
            <uni-easyinput v-model="baseForm.email" placeholder="请输入邮箱" type="email" />
          </uni-forms-item>
        </uni-forms>

        <button
          class="submit-btn"
          :loading="loading.baseInfo"
          :disabled="loading.baseInfo"
          @click="handleSubmitBaseInfo"
        >
          {{ loading.baseInfo ? '保存中...' : '保存基本信息' }}
        </button>
      </view>

      <!-- 密码修改表单 -->
      <view class="form-section">
        <text class="section-title">修改密码</text>

        <uni-forms ref="pwdFormRef" :model="pwdForm" :rules="rules">
          <uni-forms-item label="旧密码" name="oldPwd">
            <uni-easyinput
              v-model="pwdForm.oldPwd"
              placeholder="请输入旧密码"
              type="password"
              trim
            />
          </uni-forms-item>

          <uni-forms-item label="新密码" name="newPwd">
            <uni-easyinput
              v-model="pwdForm.newPwd"
              placeholder="6-20位，包含大小写字母和数字"
              type="password"
              trim
            />
          </uni-forms-item>

          <uni-forms-item label="确认密码" name="confirmPwd">
            <uni-easyinput
              v-model="pwdForm.confirmPwd"
              placeholder="请再次输入新密码"
              type="password"
              trim
            />
          </uni-forms-item>
        </uni-forms>

        <button
          class="submit-btn"
          :loading="loading.password"
          :disabled="loading.password"
          @click="handleChangePassword"
        >
          {{ loading.password ? '提交中...' : '修改密码' }}
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMemberStore } from '@/stores/member'
import { userApi, type UserDTO, type UpdatePwdDTO } from '@/api/user1'
import { uploadFileAPI } from '@/api/upload'

const memberStore = useMemberStore()
const baseFormRef = ref()
const pwdFormRef = ref()

// 基本信息表单
const baseForm = reactive({
  nickname: memberStore.profile?.nickname ?? '',
  phone: memberStore.profile?.phone ?? '',
  email:
    typeof memberStore.profile?.email === 'string'
      ? memberStore.profile.email
      : memberStore.profile?.email?.address ?? '',
})

// 密码修改表单
const pwdForm = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
})

// 加载状态
const loading = reactive({
  avatar: false,
  baseInfo: false,
  password: false,
})

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '昵称长度2-12位', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
      message: '昵称只能包含中文、英文、数字和下划线',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur',
    },
  ],
  email: [
    {
      type: 'email',
      message: '邮箱格式不正确',
      trigger: 'blur',
      transform: (value: string) => value.trim(),
    },
  ],
  oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => !value.includes(' ') || '密码不能包含空格',
      trigger: 'blur',
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      message: '需包含大小写字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => value === pwdForm.newPwd || '两次输入密码不一致',
      trigger: 'blur',
    },
  ],
}

// 上传头像
const uploadAvatar = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    if (!res.tempFilePaths?.length) return

    loading.avatar = true
    const [filePath] = res.tempFilePaths

    // 压缩图片
    const compressedRes = await new Promise<UniApp.CompressImageSuccessData>((resolve, reject) => {
      uni.compressImage({
        src: filePath,
        quality: 70,
        success: resolve,
        fail: reject,
      })
    })

    // 上传图片
    const uploadRes = await uploadFileAPI(compressedRes.tempFilePath)
    await userApi.updateAvatar(uploadRes.data)

    // 更新本地数据
    if (memberStore.profile) {
      memberStore.profile.avatar = uploadRes.data
      uni.showToast({ title: '头像更新成功', icon: 'success' })
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    uni.showToast({
      title: error instanceof Error ? error.message : '头像更新失败',
      icon: 'none',
    })
  } finally {
    loading.avatar = false
  }
}

// 提交基本信息
const handleSubmitBaseInfo = async () => {
  try {
    const valid = await baseFormRef.value.validate()
    if (!valid) return

    if (!memberStore.profile?.id) {
      throw new Error('用户信息获取失败')
    }

    loading.baseInfo = true

    const payload: UserDTO = {
      id: memberStore.profile.id,
      nickname: baseForm.nickname.trim(),
      phone: baseForm.phone.trim(),
      email: baseForm.email.trim(),
    }

    await userApi.updateUser(payload)

    // 更新store
    memberStore.profile = {
      ...memberStore.profile,
      ...payload,
    }

    uni.showToast({ title: '修改成功', icon: 'success' })
  } catch (error) {
    console.error('修改基本信息失败:', error)
    uni.showToast({
      title: error instanceof Error ? error.message : '修改失败',
      icon: 'none',
    })
  } finally {
    loading.baseInfo = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  try {
    const valid = await pwdFormRef.value.validate()
    if (!valid) return

    loading.password = true

    const { confirm } = await uni.showModal({
      title: '确认修改密码',
      content: '您确定要修改登录密码吗？',
      confirmText: '确定修改',
      confirmColor: '#e64340',
    })

    if (!confirm) return

    const payload: UpdatePwdDTO = {
      oldPwd: pwdForm.oldPwd.trim(),
      newPwd: pwdForm.newPwd.trim(),
    }

    await userApi.updatePassword(payload)

    // 清空表单
    pwdForm.oldPwd = ''
    pwdForm.newPwd = ''
    pwdForm.confirmPwd = ''

    uni.showToast({ title: '密码修改成功', icon: 'success' })
  } catch (error) {
    console.error('修改密码失败:', error)
    uni.showToast({
      title: error instanceof Error ? error.message : '密码修改失败',
      icon: 'none',
    })
  } finally {
    loading.password = false
  }
}
</script>

<style lang="scss" scoped>
.profile-edit-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.page-header {
  padding: 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;

  .header-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
  }
}

.content {
  flex: 1;
  padding: 30rpx;
  box-sizing: border-box;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .avatar-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    overflow: hidden;
    border: 2rpx solid #f5f5f5;

    .avatar {
      width: 100%;
      height: 100%;
    }

    .uploading-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .avatar-tip {
    margin-top: 20rpx;
    font-size: 26rpx;
    color: #666;
  }
}

.form-section {
  margin-bottom: 30rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .submit-btn {
    margin-top: 40rpx;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #27ba9b;
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
    transition: all 0.3s;

    &[disabled] {
      opacity: 0.6;
    }

    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }
  }
}

/* 表单样式覆盖 */
:deep(.uni-forms-item__label) {
  width: 140rpx !important;
  font-size: 28rpx;
  color: #666;
}

:deep(.uni-easyinput__content) {
  min-height: 80rpx;
  border-radius: 8rpx;
}

:deep(.uni-forms-item__error) {
  padding-left: 140rpx;
}
</style>
