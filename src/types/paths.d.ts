import type Api from '@/types'

export namespace Paths {
  /**
   ** 接口名称: 添加轮播图信息
   ** 接口地址: /banner/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostAdd {
    /** 请求 */
    interface Request extends Api.Schema.Banner {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 删除轮播图信息
   ** 接口地址: /banner/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeleteDelete {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 分页查询轮播图
   ** 接口地址: /banner/list
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetList {
    /** 请求 */
    interface Request {
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultBanner {}
  }

  /**
   ** 接口名称: 修改轮播图信息
   ** 接口地址: /banner/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.Banner {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 根据id查询一级分类
   ** 接口地址: /category
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetCategory {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultCategoryVO {}
  }

  /**
   ** 接口名称: 添加一级分类信息
   ** 接口地址: /category/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostAdd {
    /** 请求 */
    interface Request extends Api.Schema.Category {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 查询所有一级分类
   ** 接口地址: /category/alllist
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetAlllist {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListCategory {}
  }

  /**
   ** 接口名称: 删除一级分类信息
   ** 接口地址: /category/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeleteDelete {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 根据id进行分页查询
   ** 接口地址: /category/goods/temporary
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostTemporary {
    /** 请求 */
    interface Request extends Api.Schema.CategoryPageQueryDTO {}

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultGoodVO {}
  }

  /**
   ** 接口名称: 分页查询一级分类
   ** 接口地址: /category/list
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetList {
    /** 请求 */
    interface Request {
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultCategory {}
  }

  /**
   ** 接口名称: 根据商品名称进行分页查询
   ** 接口地址: /category/search
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetSearch {
    /** 请求 */
    interface Request {
      /** name */
      name?: string
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultGoodVO {}
  }

  /**
   ** 接口名称: 根据二级分类id查询商品
   ** 接口地址: /category/sub
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetSub {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultCategoryTwoVO {}
  }

  /**
   ** 接口名称: 添加二级分类信息
   ** 接口地址: /category/sub/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostAdd {
    /** 请求 */
    interface Request extends Api.Schema.CategoryTwo {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 删除二级分类信息
   ** 接口地址: /category/sub/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeleteDelete {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 查询二级分类
   ** 接口地址: /category/sub/list
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetList {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListCategoryTwo {}
  }

  /**
   ** 接口名称: 分页查询二级分类
   ** 接口地址: /category/sub/pagelist
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetPagelist {
    /** 请求 */
    interface Request {
      /** categoryId */
      categoryId?: number
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultCategoryTwo {}
  }

  /**
   ** 接口名称: 修改二级分类信息
   ** 接口地址: /category/sub/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.CategoryTwo {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 修改一级分类信息
   ** 接口地址: /category/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.Category {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: sendEmail
   ** 接口地址: /email/send
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostSend {
    /** 请求 */
    interface Request {
      /** email */
      email?: string
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 获取全部轮播图数据
   ** 接口地址: /home/banner
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetBanner {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListBannerVO {}
  }

  /**
   ** 接口名称: 获取一级分类列表
   ** 接口地址: /home/category/head
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetHead {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListCategoryVO {}
  }

  /**
   ** 接口名称: 获取全部商品数据
   ** 接口地址: /home/goods
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetGoods {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListCategoryVO {}
  }

  /**
   ** 接口名称: delete
   ** 接口地址: /message/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeleteDelete {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: getAll
   ** 接口地址: /message/getAll
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetGetAll {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: getMyMessage
   ** 接口地址: /message/getMyMessage
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetGetMyMessage {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: readMessage
   ** 接口地址: /message/readMessage
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostReadMessage {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: save
   ** 接口地址: /message/save
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostSave {
    /** 请求 */
    interface Request {
      /**  */
      content?: string
      /**  */
      jumpUrl?: string
      /**  */
      title?: string
      /**  */
      toUser?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 支付通知
   ** 接口地址: /pay/aliPay/notify
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostNotify {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 统一收单下单并支付页面接口的调用
   ** 接口地址: /pay/aliPay/{orderId}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetAliPay_OrderId {
    /** 请求 */
    interface Request {
      /** orderId */
      orderId: string
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: add
   ** 接口地址: /productMessage/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostAdd {
    /** 请求 */
    interface Request {
      /**  */
      isRespond?: number
      /**  */
      messageContent?: string
      /**  */
      parentId?: number
      /**  */
      productID?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: delete
   ** 接口地址: /productMessage/delete
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostDelete {
    /** 请求 */
    interface Request {
      /** messageId */
      messageId?: number
      /** productId */
      productId?: number
      /** type */
      type?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: getAllProductMessage
   ** 接口地址: /productMessage/getAllProductMessage
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetGetAllProductMessage {
    /** 请求 */
    interface Request {
      /** productId */
      productId?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 获取所有求购商品
   ** 接口地址: /purchase-goods
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetPurchase {
    /** 请求 */
    interface Request {}

    /** 响应 */
    type Response = Api.Schema.ResultListPurchaseGoods
  }

  /**
   ** 接口名称: 创建求购商品
   ** 接口地址: /purchase-goods
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostPurchase {
    /** 请求 */
    interface Request extends Api.Schema.PurchaseGoods {}

    /** 响应 */
    interface Response extends Api.Schema.PurchaseGoods {}
  }

  /**
   ** 接口名称: 根据类别获取求购商品
   ** 接口地址: /purchase-goods/sort/{sort}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetSort_Sort {
    /** 请求 */
    interface Request {
      /** sort */
      sort: number
    }

    /** 响应 */
    interface Response {}
  }

  /**
   ** 接口名称: 根据状态获取求购商品
   ** 接口地址: /purchase-goods/status/{status}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetStatus_Status {
    /** 请求 */
    interface Request {
      /** status */
      status: number
    }

    /** 响应 */
    interface Response {}
  }

  /**
   ** 接口名称: 获取用户的求购商品列表
   ** 接口地址: /purchase-goods/user/{userId}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetUser_UserId {
    /** 请求 */
    interface Request {
      /** userId */
      userId: number
    }

    /** 响应 */
    interface Response {}
  }

  /**
   ** 接口名称: 获取求购商品详情
   ** 接口地址: /purchase-goods/{id}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetPurchase_Id {
    /** 请求 */
    interface Request {
      /** id */
      id: number
    }

    /** 响应 */
    interface Response extends Api.Schema.PurchaseGoods {}
  }

  /**
   ** 接口名称: 更新求购商品
   ** 接口地址: /purchase-goods/{id}
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutPurchase_Id {
    /** 请求 */
    interface Request extends Api.Schema.PurchaseGoods {
      /** id */
      id: number
    }

    /** 响应 */
    interface Response extends Api.Schema.PurchaseGoods {}
  }

  /**
   ** 接口名称: 删除求购商品
   ** 接口地址: /purchase-goods/{id}
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeletePurchase_Id {
    /** 请求 */
    interface Request {
      /** id */
      id: number
    }

    /** 响应 */
    interface Response {}
  }

  /**
   ** 接口名称: 文件上传
   ** 接口地址: /upload
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostUpload {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.Resultstring {}
  }

  /**
   ** 接口名称: 添加用户收货地址信息
   ** 接口地址: /user/address/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostAdd {
    /** 请求 */
    interface Request extends Api.Schema.AddressBook {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 删除用户收货地址信息
   ** 接口地址: /user/address/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeleteDelete {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 查询当前用户的所有地址信息
   ** 接口地址: /user/address/list
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetList {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListAddressBook {}
  }

  /**
   ** 接口名称: 修改用户收货地址信息
   ** 接口地址: /user/address/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.AddressBook {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 根据用户id分页查询地址
   ** 接口地址: /user/member/address
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetAddress {
    /** 请求 */
    interface Request {
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultAddressBook {}
  }

  /**
   ** 接口名称: 根据id查询商品信息
   ** 接口地址: /user/goods
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetGoods {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultGoodVO {}
  }

  /**
   ** 接口名称: 用户添加商品
   ** 接口地址: /user/goods/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostAdd {
    /** 请求 */
    interface Request extends Api.Schema.GoodDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 删除用户收货地址信息
   ** 接口地址: /user/goods/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace ADeleteDelete {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 根据商品点赞量排序查询商品信息
   ** 接口地址: /user/goods/hot
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetHot {
    /** 请求 */
    interface Request {
      /** id */
      id?: number
      /** limit */
      limit?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultListGoodVO {}
  }

  /**
   ** 接口名称: 修改用户商品信息
   ** 接口地址: /user/goods/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.GoodDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 根据用户id分页查询商品
   ** 接口地址: /user/member/goods
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetGoods {
    /** 请求 */
    interface Request {
      /** categoryId */
      categoryId?: number
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
      /** status */
      status?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultGood {}
  }

  /**
   ** 接口名称: 分页查询用户信息
   ** 接口地址: /user/list
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetList {
    /** 请求 */
    interface Request {
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultUser {}
  }

  /**
   ** 接口名称: 用户登录
   ** 接口地址: /user/login
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostLogin {
    /** 请求 */
    interface Request {
      /**  */
      code?: string
      /**  */
      email?: string
      /**  */
      password?: string
      /**  */
      type?: string
      /**  */
      username?: string
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultUserLoginVO {}
  }

  /**
   ** 接口名称: 注册用户
   ** 接口地址: /user/register
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostRegister {
    /** 请求 */
    interface Request extends Api.Schema.UserLoginDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 查询用户出售的商品
   ** 接口地址: /user/sellGoods/{id}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetSellGoods_Id {
    /** 请求 */
    interface Request {
      /** id */
      id: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultGood {}
  }

  /**
   ** 接口名称: 修改用户状态
   ** 接口地址: /user/status/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.User {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 用户个人信息修改
   ** 接口地址: /user/update
   ** 请求方式: put
   ** 接口描述:
   */
  namespace APutUpdate {
    /** 请求 */
    interface Request extends Api.Schema.UserDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 用户头像修改
   ** 接口地址: /user/updateAvatar
   ** 请求方式: patch
   ** 接口描述:
   */
  namespace APatchUpdateAvatar {
    /** 请求 */
    interface Request {
      /** avatarUrl */
      avatarUrl: string
    }

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 用户密码修改
   ** 接口地址: /user/updatePwd
   ** 请求方式: patch
   ** 接口描述:
   */
  namespace APatchUpdatePwd {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 根据用户id分页查询订单
   ** 接口地址: /user/member/order
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetOrder {
    /** 请求 */
    interface Request {
      /** orderStatus */
      orderStatus?: number
      /** page */
      page?: number
      /** pageSize */
      pageSize?: number
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultPageResultOrderVO {}
  }

  /**
   ** 接口名称: 生成订单
   ** 接口地址: /user/order
   ** 请求方式: post
   ** 接口描述:
   */
  namespace APostOrder {
    /** 请求 */
    interface Request extends Api.Schema.CreOrderDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 订单结算页
   ** 接口地址: /user/order/pre
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetPre {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultPreOrderVO {}
  }

  /**
   ** 接口名称: 根据id查询订单
   ** 接口地址: /user/order/{id}
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AGetOrder_Id {
    /** 请求 */
    interface Request {
      /** id */
      id: string
    }

    /** 响应 */
    interface Response extends Api.Schema.ResultOrder {}
  }

  /**
   ** 接口名称: 添加购物车
   ** 接口地址: /user/shoppingCart/add
   ** 请求方式: post
   ** 接口描述:
   */
  namespace AShoppingPostAdd {
    /** 请求 */
    interface Request extends Api.Schema.ShoppingCartDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 删除购物车
   ** 接口地址: /user/shoppingCart/delete
   ** 请求方式: delete
   ** 接口描述:
   */
  namespace AShoppingDelete {
    /** 请求 */
    interface Request extends Api.Schema.ShoppingCartDTO {}

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }

  /**
   ** 接口名称: 查询购物车
   ** 接口地址: /user/shoppingCart/list
   ** 请求方式: get
   ** 接口描述:
   */
  namespace AShoppingGetList {
    /** 请求 */
    interface Request {}

    /** 响应 */
    interface Response extends Api.Schema.ResultListShoppingCart {}
  }

  /**
   ** 接口名称: 修改购物车
   ** 接口地址: /user/shoppingCart/update
   ** 请求方式: put
   ** 接口描述: 修改购物车
   */
  namespace AShoppingPutUpdate {
    /** 请求 */
    type Request = Api.Schema.ShoppingCart[]

    /** 响应 */
    interface Response extends Api.Schema.Result {}
  }
}
