/**
 * 商品分类枚举
 */
export enum GoodsCategory {
  /** 电子手机 */
  PHONE = 1,
  /** 数码产品 */
  DIGITAL = 2,
  /** 生活电器 */
  APPLIANCE = 3,
  /** 旅游箱包 */
  LUGGAGE = 4,
  /** 闲置图书 */
  BOOK = 5,
  /** 日常服装 */
  CLOTHING = 6,
  /** 运动产品 */
  SPORTS = 7,
  /** 衣服饰品 */
  ACCESSORIES = 8,
}

/**
 * 商品分类映射表
 */
export const CATEGORY_MAP = {
  [GoodsCategory.PHONE]: '电子手机',
  [GoodsCategory.DIGITAL]: '数码产品',
  [GoodsCategory.APPLIANCE]: '生活电器',
  [GoodsCategory.LUGGAGE]: '旅游箱包',
  [GoodsCategory.BOOK]: '闲置图书',
  [GoodsCategory.CLOTHING]: '日常服装',
  [GoodsCategory.SPORTS]: '运动产品',
  [GoodsCategory.ACCESSORIES]: '衣服饰品',
} as const

/**
 * 分类选项数组
 */
export const CATEGORY_OPTIONS = Object.entries(CATEGORY_MAP).map(([id, name]) => ({
  id: Number(id),
  name,
}))
