/** 通用分页结果类型 */
export type PageResult<T> = {
  /** 列表数据 */
  items: T[]
  /** 总条数 */
  counts: number
  /** 当前页数 */
  page: number
  /** 总页数 */
  pages: number
  /** 每页条数 */
  pageSize: number
}
/** 通用分页参数类型 */
export type PageParams = {
  /** 页码：默认值为 1 */
  page?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}

export interface GoodsItem {
  id: number
  name: string
  desc: string
  price: number
  originalPrice?: number
  picture: string
  pictures: string[]
  school: string
  createdAt: string | Date
  status: number // 0-在售 1-已售 2-下架
  sellerId: number
  categoryId: number
  updateTime?: string
}

export interface GoodsListResult {
  list: GoodsItem[]
  total: number
}
