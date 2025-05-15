export enum responseCode {
  SUCCESS = 0,
  ERROR = 1,
}
export namespace Schema {
  // 基础的 Result 泛型接口
  interface Result<T = any> {
    code: responseCode
    data: T
    message: string
  }

  // 分页结果的泛型接口
  interface PageResult<T> {
    items: T[]
    page: number
    pageSize: number
    pages: number
    total: number
  }

  // 地址簿
  interface AddressBook {
    cityName: string
    consignee: string
    detail: string
    districtName: string
    id: number
    isDefault: number
    label: string
    phone: string
    provinceName: string
    userId: number
  }

  // 轮播图
  interface Banner {
    createTime: string
    id: number
    imgUrl: string
    updateTime: string
  }

  // 轮播图视图对象
  interface BannerVO {
    hrefUrl: string
    id: number
    imgUrl: string
    type: number
  }

  // 一级分类
  interface Category {
    categoryPic: string
    createTime: string
    id: number
    name: string
    updateTime: string
  }

  // 分页查询分类 DTO
  interface CategoryPageQueryDTO {
    categoryId: number
    page: number
    pageSize: number
  }

  // 二级分类
  interface CategoryTwo {
    categoryId: number
    categoryPic: string
    createTime: string
    id: number
    name: string
    parentName: string
    updateTime: string
  }

  // 二级分类视图对象
  interface CategoryTwoVO {
    categoryId: number
    categoryPic: string
    goods: Array<GoodVO>
    id: number
    name: string
    parentName: string
  }

  // 一级分类视图对象
  interface CategoryVO {
    categoryPic: string
    children: Array<CategoryVO>
    goods: Array<GoodVO>
    id: number
    name: string
  }

  // 创建订单 DTO
  interface CreOrderDTO {
    addressId: number
    deliveryTimeType: number
    goods: string
    payChannel: number
    payType: number
    summary: OrderSummaryVO
  }

  // 邮箱（空接口，保持原样）
  interface Email {}

  // 商品
  interface Good {
    categoryId: number
    categoryName: string
    collectCount: number
    commentCount: number
    createTime: string
    desc: string
    id: number
    likeCount: number
    name: string
    parentId: number
    parentName: string
    picture: string
    price: number
    sellerId: number
    status: number
    updateTime: string
  }

  // 商品 DTO
  interface GoodDTO {
    categoryId: number
    desc: string
    id: number
    name: string
    picture: string
    pictures: Array<string>
    price: number
    sellerId: number
    status: number
    updateTime: string
  }

  // 商品视图对象
  interface GoodVO {
    categoryId: number
    categoryName: string
    collectCount: number
    commentCount: number
    desc: string
    id: number
    likeCount: number
    name: string
    parentId: number
    parentName: string
    picture: string
    pictures: Array<string>
    price: number
    sellerId: number
    sellerName: string
    status: number
  }

  // 订单
  interface Order {
    address: string
    addressBookId: number
    checkoutTime: string
    consignee: string
    createTime: string
    deliveryTimeType: number
    goodsId: string
    id: string
    orderStatus: number
    orderTime: string
    payAmount: number
    payChannel: number
    payLatestTime: string
    payStatus: number
    payType: number
    phone: string
    postFee: number
    totalNum: number
    totalPrice: number
    userId: number
    userName: string
  }

  // 订单摘要视图对象
  interface OrderSummaryVO {
    payAmount: number
    postFee: number
    totalNum: number
    totalPrice: number
  }

  // 订单视图对象
  interface OrderVO {
    address: string
    addressBookId: number
    checkoutTime: string
    consignee: string
    createTime: string
    deliveryTimeType: number
    goods: Array<GoodVO>
    goodsId: string
    id: string
    orderStatus: number
    orderTime: string
    payAmount: number
    payChannel: number
    payLatestTime: string
    payStatus: number
    payType: number
    phone: string
    postFee: number
    totalNum: number
    totalPrice: number
    userId: number
    userName: string
  }

  // 预订单视图对象
  interface PreOrderVO {
    goods: Array<ShoppingCart>
    summary: OrderSummaryVO
    userAddresses: Array<AddressBook>
  }

  // 求购商品
  interface PurchaseGoods {
    /**
     * 求购商品数量
     */
    count: number
    /**
     * 创建时间
     */
    createTime?: number
    /**
     * 求购商品描述
     */
    desc: string
    /**
     * 求购商品id
     */
    id?: number
    /**
     * 商品图片地址
     */
    image: string
    /**
     * 求购商品名称
     */
    name: string
    /**
     * 求购商品定价
     */
    price: number
    /**
     * 求购商品类别
     */
    sort: number
    /**
     * 求购商品状态 0:禁用, 1:启用
     */
    status: number
    /**
     * 交易方式 0:线上 1:线下
     */
    transaction: number
    /**
     * 修改时间
     */
    updateTime?: number
    /**
     * 发布求购商品的用户id
     */
    userId?: number
    [property: string]: any
  }

  // 购物车
  interface ShoppingCart {
    count: number
    createTime: string
    desc: string
    goodId: number
    id: number
    imgUrl: string
    name: string
    price: number
    selected: boolean
    userId: number
  }

  // 购物车 DTO
  interface ShoppingCartDTO {
    goodId: number
  }

  // 用户
  interface User {
    createTime: string
    email: Email
    id: number
    nickname: string
    password: string
    phone: string
    roleId: number
    status: number
    updateTime: string
    userPic: string
    username: string
  }

  // 用户 DTO
  interface UserDTO {
    email: Email
    id: number
    nickname: string
    phone: string
  }

  // 用户登录 DTO
  interface UserLoginDTO {
    code: string
    email: string
    password: string
    type: string
    username: string
  }

  // 用户登录返回视图对象
  interface UserLoginVO {
    id: number
    nickname: string
    phone: string
    roleId: number
    token: string
    userPic: string
    username: string
  }

  // 使用泛型 Result 替换原有的 Result 类型
  type ResultAddressBook = Result<AddressBook>
  type ResultListAddressBook = Result<AddressBook[]>
  type ResultPageResultAddressBook = Result<PageResult<AddressBook>>

  type ResultBanner = Result<BannerVO>
  type ResultListBannerVO = Result<BannerVO[]>
  type ResultPageResultBanner = Result<PageResult<BannerVO>>

  type ResultCategory = Result<Category>
  type ResultListCategory = Result<Category[]>
  type ResultListCategoryVO = Result<CategoryVO[]>
  type ResultCategoryVO = Result<CategoryVO>
  type ResultPageResultCategory = Result<PageResult<Category>>

  type ResultCategoryTwo = Result<CategoryTwo>
  type ResultListCategoryTwo = Result<CategoryTwo[]>
  type ResultCategoryTwoVO = Result<CategoryTwoVO>
  type ResultPageResultCategoryTwo = Result<PageResult<CategoryTwo>>

  type ResultGood = Result<Good>
  type ResultListGoodVO = Result<GoodVO[]>
  type ResultGoodVO = Result<GoodVO>
  type ResultPageResultGood = Result<PageResult<Good>>
  type ResultPageResultGoodVO = Result<PageResult<GoodVO>>

  type ResultOrder = Result<Order>
  type ResultPageResultOrderVO = Result<PageResult<OrderVO>>

  type ResultPreOrderVO = Result<PreOrderVO>

  type ResultUser = Result<User>
  type ResultPageResultUser = Result<PageResult<User>>

  type ResultUserLoginVO = Result<UserLoginVO>

  type ResultPurchaseGoods = Result<PurchaseGoods>

  type ResultShoppingCart = Result<ShoppingCart>
  type ResultListShoppingCart = Result<ShoppingCart[]>

  type Resultstring = Result<string>
}
