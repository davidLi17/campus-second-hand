// src/api/order.ts
import { http } from '@/utils/http'
import { type AddressBook } from '@/api/address'

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING_PAYMENT = 1, // 待付款
  PENDING_SHIPMENT = 2, // 待发货
  PENDING_RECEIPT = 3, // 待收货
  PENDING_REVIEW = 4, // 待评价
  COMPLETED = 5, // 已完成
  CANCELLED = 6, // 已取消
}

/**
 * 订单VO数据结构
 */
export interface OrderVO {
  id: string
  userId: number
  userName: string
  address: string
  addressBookId: number
  consignee: string
  phone: string
  goodsId: string
  goods: GoodVO[]
  orderStatus: OrderStatus
  orderTime: string
  createTime: string
  checkoutTime: string
  payAmount: number
  payChannel: number
  payLatestTime: string
  payStatus: number
  payType: number
  postFee: number
  totalNum: number
  totalPrice: number
  deliveryTimeType: number
}

/**
 * 商品VO数据结构
 */
export interface GoodVO {
  id: number
  name: string
  desc: string
  price: number
  picture: string
  pictures: string[]
  categoryId: number
  categoryName: string
  parentId: number
  parentName: string
  sellerId: number
  sellerName: string
  status: number
  likeCount: number
  collectCount: number
  commentCount: number
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  items: T[]
  page: number
  pageSize: number
  pages: number
  total: number
}

/**
 * 创建订单DTO
 */
export interface CreOrderDTO {
  addressId?: number
  deliveryTimeType?: number
  goods?: string
  payChannel?: number
  payType?: number
  summary?: OrderSummaryVO
}

/**
 * 订单汇总信息
 */
export interface OrderSummaryVO {
  payAmount?: number
  postFee?: number
  totalNum?: number
  totalPrice?: number
}

/**
 * 预订单VO
 */
export interface PreOrderVO {
  goods: ShoppingCart[]
  summary: OrderSummaryVO
  userAddresses: AddressBook[]
}

/**
 * 购物车商品
 */
export interface ShoppingCart {
  id: number
  goodId: number
  userId: number
  name: string
  imgUrl: string
  price: number
  count: number
  selected: boolean
  createTime: string
  desc: string
}

/**
 * 订单管理API
 */
export const orderApi = {
  /**
   * 分页查询订单
   * @param params 查询参数
   */
  getOrdersByPage(params: { orderStatus?: OrderStatus; page?: number; pageSize?: number }) {
    return http<PageResult<OrderVO>>({
      url: '/user/member/order',
      method: 'GET',
      params,
    })
  },

  /**
   * 生成订单
   * @param data 订单数据
   */
  createOrder(data: CreOrderDTO) {
    return http({
      url: '/user/order',
      method: 'POST',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 获取订单结算页数据
   */
  getPreOrder() {
    return http<PreOrderVO>({
      url: '/user/order/pre',
      method: 'GET',
    })
  },

  /**
   * 根据ID查询订单详情
   * @param id 订单ID
   */
  getOrderById(id: string) {
    return http<OrderVO>({
      url: `/user/order/${id}`,
      method: 'GET',
    })
  },

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

  /**
   * 修改订单状态
   * @param id 订单ID
   * @param status 目标状态
   */
  updateOrderStatus(id: string, status: OrderStatus) {
    return http({
      url: `/user/order/${id}/status/?status=${status}`,
      method: 'POST',
    })
  },

  /**
   * 删除订单
   * @param id 订单ID
   */
  deleteOrder(id: string) {
    return http({
      url: `/user/order/${id}`,
      method: 'DELETE',
    })
  },

  /**
   * 取消订单
   * @param id 订单ID
   */
  cancelOrder(id: string) {
    return this.updateOrderStatus(id, OrderStatus.CANCELLED)
  },

  /**
   * 确认收货
   * @param id 订单ID
   */
  confirmReceipt(id: string) {
    return this.updateOrderStatus(id, OrderStatus.COMPLETED)
  },

  /**
   * 标记为待评价
   * @param id 订单ID
   */
  markAsReview(id: string) {
    return this.updateOrderStatus(id, OrderStatus.PENDING_REVIEW)
  },

  /**
   * 标记为待发货
   * @param id 订单ID
   */
  markAsPendingShipment(id: string) {
    return this.updateOrderStatus(id, OrderStatus.PENDING_SHIPMENT)
  },

  /**
   * 标记为待收货
   * @param id 订单ID
   */
  markAsPendingReceipt(id: string) {
    return this.updateOrderStatus(id, OrderStatus.PENDING_RECEIPT)
  },
}
