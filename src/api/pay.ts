// src/api/pay.ts
import { http } from '@/utils/http'

/**
 * 支付API
 */
export const payApi = {
  /**
   * 支付宝支付
   * @param orderId 订单ID
   */
  aliPay(orderId: string) {
    return http({
      url: `/pay/aliPay/${orderId}`,
      method: 'GET',
    })
  },

  /**
   * 处理支付宝支付通知
   * @param data 通知数据
   */
  handleAliPayNotify(data: any) {
    return http({
      url: '/pay/aliPay/notify',
      method: 'POST',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },
}
