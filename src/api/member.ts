// src/stores/member.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginResult } from '@/types/user'

// 定义用户信息类型
export interface MemberProfile {
  id: number
  username: string
  nickname: string
  avatar: string | null
  roleId: number
}

// 定义存储的state类型
interface MemberState {
  profile: MemberProfile | null
  token: string | null
}

// 创建状态管理
export const useMemberStore = defineStore('member', () => {
  // 状态数据
  const profile = ref<MemberProfile | null>(null)
  const token = ref<string | null>(null)

  // 保存用户信息
  const setProfile = (val: LoginResult['data']) => {
    profile.value = {
      id: val.id,
      username: val.username,
      nickname: val.nickname,
      avatar: val.userPic,
      roleId: val.roleId,
    }
  }

  // 保存token
  const setToken = (val: string) => {
    token.value = val
  }

  // 清除用户信息
  const clearProfile = () => {
    profile.value = null
  }

  // 清除token
  const clearToken = () => {
    token.value = null
  }

  // 登录成功处理
  const loginSuccess = (data: LoginResult['data']) => {
    setProfile(data)
    setToken(data.token)

    // 持久化存储（可选）
    uni.setStorageSync('member_profile', profile.value)
    uni.setStorageSync('member_token', token.value)
  }

  // 登出处理
  const logout = () => {
    clearProfile()
    clearToken()

    // 清除持久化数据
    uni.removeStorageSync('member_profile')
    uni.removeStorageSync('member_token')
  }

  // 初始化时从本地存储加载
  const initFromStorage = () => {
    const profileStorage = uni.getStorageSync('member_profile')
    const tokenStorage = uni.getStorageSync('member_token')

    if (profileStorage) {
      profile.value = profileStorage
    }
    if (tokenStorage) {
      token.value = tokenStorage
    }
  }

  // 立即执行初始化
  initFromStorage()

  return {
    profile,
    token,
    setProfile,
    setToken,
    clearProfile,
    clearToken,
    loginSuccess,
    logout,
    initFromStorage,
  }
})
