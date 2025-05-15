// 登录请求参数类型
export interface LoginParams {
  username?: string
  email?: string
  password: string
  type: 'account' | 'sms'
}

// 登录响应数据类型
export interface LoginResult {
  code: number
  message: string
  data: {
    /**
     * 主键值
     */
    id: number
    /**
     * 昵称
     */
    nickname: string
    /**
     * 手机号
     */
    phone: string
    /**
     * 角色id
     */
    roleId: number
    /**
     * jwt令牌
     */
    token: string
    /**
     * 用户名
     */
    username: string
    /**
     * 用户头像地址
     */
    userPic: string
  }
}

// 用户信息类型
export interface MemberProfile {
  id: number
  username: string
  nickname: string
  phone: string | null
  userPic: string | null
  roleId: number
  token: string
}

// 更新用户信息的请求参数类型
export interface UpdateUserParams {
  email?: string
  id: number
  nickname?: string
  phone?: string
}

// 更新用户信息的响应类型
export interface UpdateUserResult {
  code: number
  message: string
  data: null
}
