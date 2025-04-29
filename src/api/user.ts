import { buildUrl } from '@/utils/url-utils'
// src/api/user.ts
import { http } from '@/utils/http'
import type { LoginParams, LoginResult } from '@/types/user'

import type { UpdateUserParams, UpdateUserResult } from '@/api/types/user'

/**
 * 用户登录
 * @param params 登录参数
 */
export const loginAPI = (params: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: buildUrl('/user/login', { ...params }),
  })
}

// src/api/user.ts
/**
 * 用户注册（简化版）
 * @param params 注册参数
 */
export const registerAPI = (params: {
  username: string
  password: string
  email: string
  type: string
}) => {
  return http<{
    code: number
    data: null
    message: string
  }>({
    method: 'POST',
    url: '/user/register',
    data: {
      ...params,
      code: '1', // 固定值，根据API要求保留
    },
  })
}

/**
 * 更新用户信息
 * @param data 更新参数
 */
export const updateUserAPI = (data: UpdateUserParams) => {
  return http<UpdateUserResult>({
    method: 'PUT',
    url: '/user/update',
    data,
  })
}
