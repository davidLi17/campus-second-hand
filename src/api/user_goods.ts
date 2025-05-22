// src/api/goods.ts
import { http } from '@/utils/http'

// 商品类型定义
export interface Good {
  id?: number
  categoryId?: number
  categoryName?: string
  collectCount?: number
  commentCount?: number
  createTime?: string
  desc?: string
  likeCount?: number
  name?: string
  parentId?: number
  parentName?: string
  picture?: string
  pictures?: string[]
  price?: number
  sellerId?: number
  sellerName?: string
  status?: number
  updateTime?: string
}

/**
 * 商品留言类型定义
 */
export interface ProductMessage {
  id?: number
  productId: number
  userId?: number
  username?: string
  avatar?: string
  messageContent: string
  createTime?: string
  isRespond?: boolean
  parentId?: number
  replies?: ProductMessage[]
}

/**
 * 分页结果类型
 */
interface PageResult<T> {
  items: T[]
  page: number
  pageSize: number
  pages: number
  total: number
}

/**
 * 基础响应类型
 */
interface Result<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 商品留言API
 */
export const productMessageApi = {
  /**
   * 添加留言
   * @param params 留言参数
   */
  async addMessage(params: {
    productID: number
    messageContent: string
    parentId?: number
    isRespond: number
  }): Promise<Result> {
    return http({
      url: '/productMessage/add',
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 删除留言
   * @param params 删除参数
   */
  async deleteMessage(params: {
    messageId?: number
    productId?: number
    type?: number
  }): Promise<Result> {
    return http({
      url: '/productMessage/delete',
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 获取商品所有留言
   * @param productId 商品ID
   */
  async getAllMessages(productId: number): Promise<Result<ProductMessage[]>> {
    return http({
      url: `/productMessage/getAllProductMessage?productId=${productId}`,
      method: 'GET',
    })
  },

  /**
   * 分页获取商品留言
   * @param params 分页参数
   */
  async getMessagesByPage(params: {
    productId: number
    page: number
    pageSize: number
  }): Promise<Result<PageResult<ProductMessage>>> {
    const query = new URLSearchParams()
    query.append('productId', params.productId.toString())
    query.append('page', params.page.toString())
    query.append('pageSize', params.pageSize.toString())

    return http({
      url: `/productMessage/page?${query.toString()}`,
      method: 'GET',
    })
  },

  /**
   * 回复留言
   * @param params 回复参数
   */
  async replyMessage(params: {
    productId: number
    parentId: number
    messageContent: string
  }): Promise<Result> {
    return this.addMessage({
      ...params,
      isRespond: true,
    })
  },
}

/**
 * 商品API扩展
 */
export const goodsApi = {
  /**
   * 根据ID查询商品信息
   * @param id 商品ID
   */
  getById(id: number): Promise<Result<Good>> {
    return http({
      url: `/user/goods?id=${id}`,
      method: 'GET',
    })
  },

  /**
   * 分页获取用户出售的商品
   * @param params 分页参数
   */
  getSellGoods(params: {
    page: number
    pageSize: number
    status?: number
    categoryId?: number
  }): Promise<Result<PageResult<Good>>> {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    return http({
      url: `/user/member/goods?${query}`,
      method: 'GET',
    })
  },

  /**
   * 修改商品信息
   * @param data 商品数据
   */
  updateGood(data: Good): Promise<Result<void>> {
    return http({
      url: '/user/goods/update',
      method: 'PUT',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 添加商品
   * @param data 商品数据
   */
  addGood(data: Omit<Good, 'id'>): Promise<Result<void>> {
    return http({
      url: '/user/goods/add',
      method: 'POST',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 删除商品
   * @param id 商品ID
   */
  deleteGood(id: number): Promise<Result<boolean>> {
    return http({
      url: `/user/goods/delete/?id=${id}`,
      method: 'DELETE',
    })
  },

  /**
   * 修改商品状态
   * @param id 商品ID
   * @param status 新状态
   */
  changeStatus(id: number, status: number): Promise<Result<boolean>> {
    return http({
      url: `/goods/${id}/status`,
      method: 'PATCH',
      data: { status },
    })
  },

  /**
   * 获取商品详情（包含留言）
   * @param id 商品ID
   */
  async getDetailWithMessages(id: number): Promise<
    Result<{
      goods: Good
      messages: ProductMessage[]
    }>
  > {
    const [goodsRes, messagesRes] = await Promise.all([
      this.getById(id),
      productMessageApi.getAllMessages(id),
    ])

    if (goodsRes.code !== 0 || messagesRes.code !== 0) {
      return {
        code: -1,
        message: '获取商品详情失败',
        data: null,
      }
    }

    return {
      code: 0,
      message: 'success',
      data: {
        goods: goodsRes.data,
        messages: messagesRes.data,
      },
    }
  },
}

// 状态枚举
export const GoodStatus = {
  ON_SALE: 1,
  SOLD_OUT: 2,
  OFF_SHELF: 3,
  PENDING_REVIEW: 4,
} as const
