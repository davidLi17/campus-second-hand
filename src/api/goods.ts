// src/api/goods.ts
import { http } from '@/utils/http'

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
    headers: {
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
      Accept: '*/*',
      Connection: 'keep-alive',
    },
  })
}
