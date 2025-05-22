// src/api/email.ts
import { http } from '@/utils/http'

/**
 * 发送验证码请求参数
 */
export interface SendEmailParams {
  email: string
}

/**
 * 发送验证码
 * @param params 请求参数
 * @returns 发送结果
 */
export const sendEmailApi = (params: SendEmailParams) => {
  return http({
    method: 'POST',
    url: '/email/send',
    data: params,
  })
}
