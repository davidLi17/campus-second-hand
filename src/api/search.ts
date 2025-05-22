// src/api/search.ts
import { http } from '@/utils/http'
import type { PageParams, PageResult } from '@/types/global'
// import type { GoodDoc } from '@/types/goods'

// src/types/goods.ts
/**
 * 商品文档类型（ES搜索结果）
 */
export interface GoodDoc {
  id: number
  parentId: number
  parentName: string
  categoryId: number
  categoryName: string
  name: string
  price: number
  desc: string
  picture: string
  likeCount: number
  collectCount: number
}
/**
 * 商品搜索参数
 */
export type SearchParams = PageParams & {
  keyword: string
}

/**
 * 商品搜索结果
 */
export type SearchResult = PageResult<GoodDoc>

/**
 * 模糊查询商品
 * @param params 搜索参数
 * @returns 搜索结果
 */
export const searchApi = (params: SearchParams) => {
  return http<SearchResult>({
    method: 'GET',
    url: '/es/search?keyword=' + params.keyword,
    // params,
  })
}
