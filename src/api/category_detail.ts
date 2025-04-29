// src/api/category.ts
import { http } from '@/utils/http'

/**
 * 获取分类详情及商品列表
 * @param id 分类ID
 */
export const getCategoryDetailAPI = (id: number) => {
  return http<{
    code: number
    data: {
      id: number
      name: string
      categoryPic: string
      children: Array<{
        id: number
        name: string
      }>
      goods: Array<{
        id: number
        name: string
        picture: string
        price: number
        desc: string
        // 其他商品字段...
      }>
    }
    message: string
  }>({
    method: 'GET',
    url: `/category?id=${id}`,
  })
}
