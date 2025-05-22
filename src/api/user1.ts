// src/api/user.ts
import { http } from '@/utils/http'

/**
 * 用户邮箱信息
 */
interface Email {
  address: string
  verified?: boolean
}

/**
 * 用户信息DTO
 */
export interface UserDTO {
  id?: number
  nickname?: string
  phone?: string
  email?: string | Email
  avatar?: string
}

/**
 * 修改密码DTO
 */
export interface UpdatePwdDTO {
  oldPwd: string
  newPwd: string
}

/**
 * 用户API
 */
export const userApi = {
  /**
   * 更新用户基本信息
   */
  async updateUser(data: UserDTO) {
    return await http({
      url: '/user/update',
      method: 'PUT',
      data,
      header: { 'Content-Type': 'application/json' },
    })
  },

  /**
   * 更新用户头像
   */
  async updateAvatar(avatarUrl: string) {
    return await http({
      url: '/user/updateAvatar?avatarUrl=' + encodeURIComponent(avatarUrl),
      method: 'PATCH',
      data: { avatarUrl }, // 改为data传递更安全
    })
  },

  /**
   * 修改用户密码
   */
  async updatePassword(data: UpdatePwdDTO) {
    return await http({
      url: '/user/updatePwd',
      method: 'PATCH',
      data,
      header: { 'Content-Type': 'application/json' },
    })
  },
}
