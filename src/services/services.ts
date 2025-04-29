/** Tip: 需要手动引入 request 函数 */
import request from '@/services/index'
import type Api from '@/types'
/**
 * 轮播图相关接口
 */

/** 添加轮播图信息 - POST /banner/add */
export function addBanner(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/banner/add`,
    method: 'POST',
    data: params,
  })
}

/** 删除轮播图信息 - DELETE /banner/delete */
export function deleteBanner(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/banner/delete`,
    method: 'DELETE',
    data: params,
  })
}

/** 分页查询轮播图 - GET /banner/list */
export function getBannerList(params: Api.Paths.AGetList.Request) {
  return request<Promise<Api.Paths.AGetList.Response>>({
    url: `/banner/list`,
    method: 'GET',
    data: params,
  })
}

/** 修改轮播图信息 - PUT /banner/update */
export function updateBanner(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/banner/update`,
    method: 'PUT',
    data: params,
  })
}

/** 获取全部轮播图数据 - GET /home/banner */
export function getAllBanners(params?: Api.Paths.AGetBanner.Request) {
  return request<Promise<Api.Paths.AGetBanner.Response>>({
    url: `/home/banner`,
    method: 'GET',
    data: params,
  })
}

/**
 * 一级分类相关接口
 */

/** 根据id查询一级分类 - GET /category */
export function getCategoryById(params: Api.Paths.AGetCategory.Request) {
  return request<Promise<Api.Paths.AGetCategory.Response>>({
    url: `/category`,
    method: 'GET',
    data: params,
  })
}

/** 添加一级分类信息 - POST /category/add */
export function addCategory(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/category/add`,
    method: 'POST',
    data: params,
  })
}

/** 查询所有一级分类 - GET /category/alllist */
export function getAllCategories(params?: Api.Paths.AGetAlllist.Request) {
  return request<Promise<Api.Paths.AGetAlllist.Response>>({
    url: `/category/alllist`,
    method: 'GET',
    data: params,
  })
}

/** 删除一级分类信息 - DELETE /category/delete */
export function deleteCategory(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/category/delete`,
    method: 'DELETE',
    data: params,
  })
}

/** 分页查询一级分类 - GET /category/list */
export function getCategoryList(params: Api.Paths.AGetList.Request) {
  return request<Promise<Api.Paths.AGetList.Response>>({
    url: `/category/list`,
    method: 'GET',
    data: params,
  })
}

/** 根据商品名称进行分页查询 - GET /category/search */
export function getCategorySearch(params: Api.Paths.AGetSearch.Request) {
  return request<Promise<Api.Paths.AGetSearch.Response>>({
    url: `/category/search`,
    method: 'GET',
    data: params,
  })
}

/** 根据id进行分页查询 - POST /category/goods/temporary */
export function getCategoryPostTemporary(params: Api.Paths.APostTemporary.Request) {
  return request<Promise<Api.Paths.APostTemporary.Response>>({
    url: `/category/goods/temporary`,
    method: 'POST',
    data: params,
  })
}

/** 获取一级分类列表 - GET /home/category/head */
export function getCategoryHead(params?: Api.Paths.AGetHead.Request) {
  return request<Promise<Api.Paths.AGetHead.Response>>({
    url: `/home/category/head`,
    method: 'GET',
    data: params,
  })
}

/** 修改一级分类信息 - PUT /category/update */
export function getCategoryPutUpdate(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/category/update`,
    method: 'PUT',
    data: params,
  })
}

/**
 * 二级分类相关接口
 */

/** 根据二级分类id查询商品 - GET /category/sub */
export function getSubCategoryById(params: Api.Paths.AGetSub.Request) {
  return request<Promise<Api.Paths.AGetSub.Response>>({
    url: `/category/sub`,
    method: 'GET',
    data: params,
  })
}

/** 添加二级分类信息 - POST /category/sub/add */
export function getSubCategoryPostAdd(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/category/sub/add`,
    method: 'POST',
    data: params,
  })
}

/** 删除二级分类信息 - DELETE /category/sub/delete */
export function SubCategoryDeleteDelete(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/category/sub/delete`,
    method: 'DELETE',
    data: params,
  })
}

/** 查询二级分类 - GET /category/sub/list */
export function SubCategoryGetList(params: Api.Paths.AGetList.Request) {
  return request<Promise<Api.Paths.AGetList.Response>>({
    url: `/category/sub/list`,
    method: 'GET',
    data: params,
  })
}

/** 修正：添加 categoryId 可选参数 */
export function SubCategoryGetPageList(params: Api.Paths.AGetPagelist.Request) {
  return request<Promise<Api.Paths.AGetPagelist.Response>>({
    url: `/category/sub/pagelist`,
    method: 'GET',
    data: params,
  })
}

/** 修改二级分类信息 - PUT /category/sub/update */
export function SubCategoryPutUpdate(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/category/sub/update`,
    method: 'PUT',
    data: params,
  })
}

/**
 * 邮件相关接口
 */

/** 发送邮件 - POST /email/send */
export function EmailPostSend(params: Api.Paths.APostSend.Request) {
  return request<Promise<Api.Paths.APostSend.Response>>({
    url: `/email/send`,
    method: 'POST',
    data: params,
  })
}

/**
 * 商品相关接口
 */

/** 获取全部商品数据 - GET /home/goods */
export function GoodsGetAll(params: Api.Paths.AGetGoods.Request) {
  return request<Promise<Api.Paths.AGetGoods.Response>>({
    url: `/home/goods`,
    method: 'GET',
    data: params,
  })
}

/** 根据id查询商品信息 - GET /user/goods */
export function GoodsGetById(params: Api.Paths.AGetGoods.Request) {
  return request<Promise<Api.Paths.AGetGoods.Response>>({
    url: `/user/goods`,
    method: 'GET',
    data: params,
  })
}

/** 用户添加商品 - POST /user/goods/add */
export function GoodsPostAdd(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/user/goods/add`,
    method: 'POST',
    data: params,
  })
}

/** 删除用户商品信息 - DELETE /user/goods/delete */
export function GoodsDeleteDelete(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/user/goods/delete`,
    method: 'DELETE',
    data: params,
  })
}

/** 根据商品点赞量排序查询商品信息 - GET /user/goods/hot */
export function GoodsGetHot(params: Api.Paths.AGetHot.Request) {
  return request<Promise<Api.Paths.AGetHot.Response>>({
    url: `/user/goods/hot`,
    method: 'GET',
    data: params,
  })
}

/** 修改用户商品信息 - PUT /user/goods/update */
export function GoodsPutUpdate(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/user/goods/update`,
    method: 'PUT',
    data: params,
  })
}

/** 根据用户id分页查询商品 - GET /user/member/goods */
export function GoodsGetByUserId(params: Api.Paths.AGetGoods.Request) {
  return request<Promise<Api.Paths.AGetGoods.Response>>({
    url: `/user/member/goods`,
    method: 'GET',
    data: params,
  })
}

/**
 * 消息相关接口
 */

/** 删除消息 - DELETE /message/delete */
export function MessageDeleteDelete(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/message/delete`,
    method: 'DELETE',
    data: params,
  })
}

/** 获取所有消息 - GET /message/getAll */
export function MessageGetAll(params?: Api.Paths.AGetGetAll.Request) {
  return request<Promise<Api.Paths.AGetGetAll.Response>>({
    url: `/message/getAll`,
    method: 'GET',
    data: params,
  })
}

/** 获取我的消息 - GET /message/getMyMessage */
export function MessageGetMyMessage(params?: Api.Paths.AGetGetMyMessage.Request) {
  return request<Promise<Api.Paths.AGetGetMyMessage.Response>>({
    url: `/message/getMyMessage`,
    method: 'GET',
    data: params,
  })
}

/** 标记消息为已读 - POST /message/readMessage */
export function MessagePostRead(params: Api.Paths.APostReadMessage.Request) {
  return request<Promise<Api.Paths.APostReadMessage.Response>>({
    url: `/message/readMessage`,
    method: 'POST',
    data: params,
  })
}

/** 保存消息 - POST /message/save */
export function MessagePostSave(params: Api.Paths.APostSave.Request) {
  return request<Promise<Api.Paths.APostSave.Response>>({
    url: `/message/save`,
    method: 'POST',
    data: params,
  })
}

/**
 * 支付相关接口
 */

/** 支付通知 - POST /pay/aliPay/notify */
export function PayPostNotify(params?: Api.Paths.APostNotify.Request) {
  return request<Promise<Api.Paths.APostNotify.Response>>({
    url: `/pay/aliPay/notify`,
    method: 'POST',
    data: params,
  })
}

/** 统一收单下单并支付页面接口的调用 - GET /pay/aliPay/{orderId} */
export function PayGetAliPayByOrderId(params: Api.Paths.AGetAliPay_OrderId.Request) {
  return request<Promise<Api.Paths.AGetAliPay_OrderId.Response>>({
    url: `/pay/aliPay/${params.orderId}`,
    method: 'GET',
    data: params,
  })
}

/**
 * 商品消息相关接口
 */

/** 添加商品消息 - POST /productMessage/add */
export function ProductMessagePostAdd(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/productMessage/add`,
    method: 'POST',
    data: params,
  })
}

/** 删除商品消息 - POST /productMessage/delete */
export function ProductMessagePostDelete(params: Api.Paths.APostDelete.Request) {
  return request<Promise<Api.Paths.APostDelete.Response>>({
    url: `/productMessage/delete`,
    method: 'POST',
    data: params,
  })
}

/** 获取所有商品消息 - GET /productMessage/getAllProductMessage */
export function ProductMessageGetAll(params: Api.Paths.AGetGetAllProductMessage.Request) {
  return request<Promise<Api.Paths.AGetGetAllProductMessage.Response>>({
    url: `/productMessage/getAllProductMessage`,
    method: 'GET',
    data: params,
  })
}

/**
 * 求购商品相关接口
 */

/** 获取所有求购商品 - GET /purchase-goods */
export function PurchaseGoodsGetAll(params?: Api.Paths.AGetPurchase.Request) {
  return request<Promise<Api.Paths.AGetPurchase.Response>>({
    url: `/purchase-goods`,
    method: 'GET',
    data: params,
  })
}

/** 创建求购商品 - POST /purchase-goods */
export function PurchaseGoodsPostCreate(params: Api.Paths.APostPurchase.Request) {
  return request<Promise<Api.Paths.APostPurchase.Response>>({
    url: `/purchase-goods`,
    method: 'POST',
    data: params,
  })
}

/** 根据类别获取求购商品 - GET /purchase-goods/sort/{sort} */
export function PurchaseGoodsGetBySort(params: Api.Paths.AGetSort_Sort.Request) {
  return request<Promise<Api.Paths.AGetSort_Sort.Response>>({
    url: `/purchase-goods/sort/${params.sort}`,
    method: 'GET',
    data: params,
  })
}

/** 根据状态获取求购商品 - GET /purchase-goods/status/{status} */
export function PurchaseGoodsGetByStatus(params: Api.Paths.AGetStatus_Status.Request) {
  return request<Promise<Api.Paths.AGetStatus_Status.Response>>({
    url: `/purchase-goods/status/${params.status}`,
    method: 'GET',
    data: params,
  })
}

/** 获取用户的求购商品列表 - GET /purchase-goods/user/{userId} */
export function PurchaseGoodsGetByUserId(params: Api.Paths.AGetUser_UserId.Request) {
  return request<Promise<Api.Paths.AGetUser_UserId.Response>>({
    url: `/purchase-goods/user/${params.userId}`,
    method: 'GET',
    data: params,
  })
}

/** 获取求购商品详情 - GET /purchase-goods/{id} */
export function PurchaseGoodsGetById(params: Api.Paths.AGetPurchase_Id.Request) {
  return request<Promise<Api.Paths.AGetPurchase_Id.Response>>({
    url: `/purchase-goods/${params.id}`,
    method: 'GET',
    data: params,
  })
}

/** 更新求购商品 - PUT /purchase-goods/{id} */
export function PurchaseGoodsPutUpdate(params: Api.Paths.APutPurchase_Id.Request) {
  return request<Promise<Api.Paths.APutPurchase_Id.Response>>({
    url: `/purchase-goods/${params.id}`,
    method: 'PUT',
    data: params,
  })
}

/** 删除求购商品 - DELETE /purchase-goods/{id} */
export function PurchaseGoodsDeleteDelete(params: Api.Paths.ADeletePurchase_Id.Request) {
  return request<Promise<Api.Paths.ADeletePurchase_Id.Response>>({
    url: `/purchase-goods/${params.id}`,
    method: 'DELETE',
    data: params,
  })
}

/**
 * 文件上传接口
 */

/** 文件上传 - POST /upload */
export function UploadPostUpload(params: FormData) {
  return request<Promise<Api.Paths.APostUpload.Response>>({
    url: `/upload`,
    method: 'POST',
    data: params,
  })
}

/**
 * 用户地址相关接口
 */

/** 添加用户收货地址信息 - POST /user/address/add */
export function UserAddressPostAdd(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/user/address/add`,
    method: 'POST',
    data: params,
  })
}

/** 删除用户收货地址信息 - DELETE /user/address/delete */
export function UserAddressDeleteDelete(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/user/address/delete`,
    method: 'DELETE',
    data: params,
  })
}

/**
 * Address-related interfaces
 */

/** 查询当前用户的所有地址信息 - GET /user/address/list */
export function UserAddressGetList(params?: Api.Paths.AGetList.Request) {
  return request<Promise<Api.Paths.AGetList.Response>>({
    url: `/user/address/list`,
    method: 'GET',
    data: params,
  })
}

/** 修改用户收货地址信息 - PUT /user/address/update */
export function UserAddressPutUpdate(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/user/address/update`,
    method: 'PUT',
    data: params,
  })
}

/** 根据用户id分页查询地址 - GET /user/member/address */
export function UserAddressGetByUserId(params: Api.Paths.AGetAddress.Request & { userId: number }) {
  return request<Promise<Api.Paths.AGetAddress.Response>>({
    url: `/user/member/address`,
    method: 'GET',
    data: params,
  })
}

/**
 * User-related interfaces
 */

/** 分页查询用户信息 - GET /user/list */
export function UserGetList(params: Api.Paths.AGetList.Request) {
  return request<Promise<Api.Paths.AGetList.Response>>({
    url: `/user/list`,
    method: 'GET',
    data: params,
  })
}

/** 用户登录 - POST /user/login */
export function UserPostLogin(params: Api.Paths.APostLogin.Request) {
  return request<Promise<Api.Paths.APostLogin.Response>>({
    url: `/user/login`,
    method: 'POST',
    data: params,
  })
}

/** 注册用户 - POST /user/register */
export function UserPostRegister(params: Api.Paths.APostRegister.Request) {
  return request<Promise<Api.Paths.APostRegister.Response>>({
    url: `/user/register`,
    method: 'POST',
    data: params,
  })
}

/** 查询用户出售的商品 - GET /user/sellGoods/{id} */
export function UserGetSellGoodsById(
  params: Api.Paths.AGetSellGoods_Id.Request & { page: number; pageSize: number },
) {
  return request<Promise<Api.Paths.AGetSellGoods_Id.Response>>({
    url: `/user/sellGoods/${params.id}`,
    method: 'GET',
    data: params,
  })
}

/** 修改用户状态 - PUT /user/status/update */
export function UserPutUpdateStatus(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/user/status/update`,
    method: 'PUT',
    data: params,
  })
}

/** 用户个人信息修改 - PUT /user/update */
export function UserPutUpdateProfile(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/user/update`,
    method: 'PUT',
    data: params,
  })
}

/** 用户头像修改 - PATCH /user/updateAvatar */
export function UserPatchUpdateAvatar(params: Api.Paths.APatchUpdateAvatar.Request) {
  return request<Promise<Api.Paths.APatchUpdateAvatar.Response>>({
    url: `/user/updateAvatar`,
    method: 'PATCH',
    data: params,
  })
}

/** 用户密码修改 - PATCH /user/updatePwd */
export function UserPatchUpdatePassword(params: Api.Paths.APatchUpdatePwd.Request) {
  return request<Promise<Api.Paths.APatchUpdatePwd.Response>>({
    url: `/user/updatePwd`,
    method: 'PATCH',
    data: params,
  })
}

/**
 * Order-related interfaces
 */

/** 根据用户id分页查询订单 - GET /user/member/order */
export function getOrderByUserId(params: Api.Paths.AGetOrder.Request) {
  return request<Promise<Api.Paths.AGetOrder.Response>>({
    url: `/user/member/order`,
    method: 'GET',
    data: params,
  })
}

/** 生成订单 - POST /user/order */
export function createUserOrder(params: Api.Paths.APostOrder.Request) {
  return request<Promise<Api.Paths.APostOrder.Response>>({
    url: `/user/order`,
    method: 'POST',
    data: params,
  })
}

/** 订单结算页 - GET /user/order/pre */
export function getOrderPre(params: Api.Paths.AGetPre.Request & { goodsIds: string }) {
  return request<Promise<Api.Paths.AGetPre.Response>>({
    url: `/user/order/pre`,
    method: 'GET',
    data: params,
  })
}

/** 根据id查询订单 - GET /user/order/{id} */
export function getOrderById(params: Api.Paths.AGetOrder_Id.Request) {
  return request<Promise<Api.Paths.AGetOrder_Id.Response>>({
    url: `/user/order/${params.id}`,
    method: 'GET',
    data: params,
  })
}

/**
 * Shopping Cart-related interfaces
 */

/** 添加购物车 - POST /user/shoppingCart/add */
export function ShoppingCartPostAdd(params: Api.Paths.APostAdd.Request) {
  return request<Promise<Api.Paths.APostAdd.Response>>({
    url: `/user/shoppingCart/add`,
    method: 'POST',
    data: params,
  })
}

/** 删除购物车 - DELETE /user/shoppingCart/delete */
export function ShoppingCartDeleteDelete(params: Api.Paths.ADeleteDelete.Request) {
  return request<Promise<Api.Paths.ADeleteDelete.Response>>({
    url: `/user/shoppingCart/delete`,
    method: 'DELETE',
    data: params,
  })
}

/** 查询购物车 - GET /user/shoppingCart/list */
export function ShoppingCartGetList(params?: Api.Paths.AGetList.Request) {
  return request<Promise<Api.Paths.AGetList.Response>>({
    url: `/user/shoppingCart/list`,
    method: 'GET',
    data: params,
  })
}

/** 修改购物_cart - PUT /user/shoppingCart/update */
export function ShoppingCartPutUpdate(params: Api.Paths.APutUpdate.Request) {
  return request<Promise<Api.Paths.APutUpdate.Response>>({
    url: `/user/shoppingCart/update`,
    method: 'PUT',
    data: params,
  })
}
