// 商品详情类型
export interface GoodsDetail {
  id: number
  name: string
  desc: string
  price: number
  originalPrice?: number
  images: string[]
  content: string
  school: string
  createdAt: string
  sellerId: number
  sellerName: string
  sellerAvatar: string
  sellerPhone: string
  sellerCredit: string
  isFavorite: boolean
  status: number // 0-在售 1-已售 2-下架
}

// 分类商品类型
export interface CategoryGoods {
  type: string
  list: GoodsItem[]
  total: number
}
