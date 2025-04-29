// src/api/goods.ts
import { http } from '@/utils/http'
import { buildUrl } from '@/utils/url-utils'

/**
 * 获取全部商品列表
 */
export const getGoodsListAPI = () => {
  return http<{
    code: number
    data: Array<{
      id: number
      name: string
      categoryPic: string
      goods: Array<{
        id: number
        name: string
        picture: string
        price: number
        desc: string
        categoryId: number
        // 其他商品字段...
      }>
    }>
    message: string
  }>({
    method: 'GET',
    url: '/home/goods',
  })
}

export const addGoodsAPI = () => {}

/**
 * 获取商品详情
 * @param id 商品ID
 */
export const getGoodsDetailAPI = (id: number) => {
  return http<{
    code: number
    data: {
      id: number
      name: string
      desc: string
      price: number
      picture: string
      pictures: string[]
      categoryId: number
      categoryName: string
      collectCount: number
      commentCount: number
      likeCount: number
      sellerId: number
      sellerName: string
      status: number
    }
    message: string
  }>({
    method: 'GET',
    url: `/user/goods?id=${id}`,
  })
}

// 商品发布参数类型
export interface PublishGoodsParams {
  categoryId: number
  desc: string
  name: string
  picture: string
  pictures: string[]
  price: number
  status?: number // 默认为0-在售
}

// 商品发布响应类型
export interface PublishGoodsResult {
  code: number
  message: string
  data: {
    id: number
    updateTime: string
  }
}

/**
 * 发布二手商品
 * @param data 商品数据
 */
export const publishGoodsAPI = (data: PublishGoodsParams) => {
  return http<PublishGoodsResult>({
    method: 'POST',
    url: '/user/goods/add',
    data: {
      ...data,
      status: data.status || 0, // 默认在售状态
    },
  })
}

// 搜索商品参数类型
export interface SearchGoodsParams {
  name: string
  page: number
  pageSize: number
}

// 搜索商品响应类型
export interface SearchGoodsResult {
  code: number
  message: string
  data: {
    items: {
      id: number
      name: string
      price: number
      picture: string
      sellerName: string
      likeCount: number
      categoryName: string
      // 其他字段...
    }[]
    page: number
    pageSize: number
    pages: number
    total: number
  }
}

/**
 * 搜索商品
 * @param params 搜索参数
 */
export const searchGoodsAPI = (params: SearchGoodsParams) => {
  return http<SearchGoodsResult>({
    method: 'GET',
    url: buildUrl('/category/search', {
      ...params,
    }),
  })
}

/**
 * 获取热门商品
 * @param params 请求参数 { id: 分类ID, limit: 数量限制 }
 */
export const getHotGoodsAPI = (params: { id: number; limit: number }) => {
  return http<{
    code: number
    message: string
    data: Array<{
      id: number
      name: string
      price: number
      picture: string
      sellerName: string
      likeCount: number
      categoryName: string
      // 其他字段...
    }>
  }>({
    method: 'GET',
    url: buildUrl('/user/goods/hot', { ...params }),
  })
}
