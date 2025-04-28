// 轮播图项类型
export interface BannerItem {
  id: number
  imgUrl: string
  hrefUrl: string
  type: number
}

// 商品项类型
export interface GoodsItem {
  id: number
  name: string
  desc: string
  price: number
  originalPrice?: number
  picture: string
  school: string
  createdAt: string
  status: number
  categoryId: number
}
