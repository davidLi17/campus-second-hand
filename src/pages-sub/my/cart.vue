<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import type Api from '@/types/index'
import {
  ShoppingCartGetList,
  ShoppingCartPostAdd,
  ShoppingCartDeleteDelete,
  ShoppingCartPutUpdate,
} from '@/services/services.ts'

// 购物车数据
const cartList = ref<Api.Paths.AShoppingGetList.Response['data']>([])

// 全选状态
const allSelected = ref(false)

// 获取购物车列表
const fetchCartList = async () => {
  try {
    const res = await ShoppingCartGetList()
    if (!res || !res.data) throw new Error('获取购物车数据失败')
    cartList.value = res.data
  } catch (error) {
    uni.showToast({
      title: '获取购物车失败',
      icon: 'none',
    })
    cartList.value = []
  }
  updateAllSelected()
}

// 页面加载
onLoad(() => {
  fetchCartList()
})

// 更新全选状态
const updateAllSelected = () => {
  allSelected.value = cartList.value.length > 0 && cartList.value.every((item) => item.selected)
}

// 切换商品选中状态
const toggleSelect = async (index: number) => {
  cartList.value[index].selected = !cartList.value[index].selected
  updateAllSelected()
  // 更新后端选中状态
  try {
    const res = await ShoppingCartPutUpdate(cartList.value)
    if (res.code !== 0) {
      throw new Error('更新选中状态失败')
    }
  } catch (e) {
    uni.showToast({
      title: '更新选中状态失败',
      icon: 'none',
    })
    cartList.value[index].selected = !cartList.value[index].selected // 回滚选中状态
  }
}

// 切换全选状态
const toggleAllSelect = async () => {
  allSelected.value = !allSelected.value
  cartList.value.forEach((item) => {
    item.selected = allSelected.value
  })
  // 批量更新后端选中状态
  try {
    await Promise.all(
      cartList.value.map((item) =>
        ShoppingCartPutUpdate({
          id: item.id,
          selected: item.selected,
        } as any),
      ),
    )
  } catch (e) {
    // 忽略错误
  }
}

// 修改商品数量
const changeCount = async (index: number, type: 'add' | 'minus') => {
  if (type === 'add') {
    cartList.value[index].count++
  } else if (type === 'minus' && cartList.value[index].count > 1) {
    cartList.value[index].count--
  }
  // 更新后端数量
  try {
    await ShoppingCartPutUpdate({
      id: cartList.value[index].id,
      count: cartList.value[index].count,
    } as any)
  } catch (e) {
    // 忽略错误
  }
}

// 删除商品
const deleteItem = (index: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await ShoppingCartDeleteDelete({ id: cartList.value[index].id } as any)
        } catch (e) {
          // 忽略错误
        }
        cartList.value.splice(index, 1)
        updateAllSelected()
        uni.showToast({
          title: '删除成功',
          icon: 'success',
        })
      }
    },
  })
}

// 计算选中商品总价
const totalPrice = computed(() => {
  return cartList.value
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.count, 0)
})

// 结算
const checkout = () => {
  const selectedItems = cartList.value.filter((item) => item.selected)
  if (selectedItems.length === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none',
    })
    return
  }
  // 跳转到订单确认页面
  uni.navigateTo({
    url: '/pages/order/confirm',
    success: () => {
      // 这里可以传递选中的商品信息
    },
  })
}

// 跳转到商品详情
const gotoDetail = (goodId: number) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${goodId}`,
  })
}
</script>

<template>
  <view class="cart-page">
    <!-- 购物车列表 -->
    <scroll-view scroll-y class="cart-list">
      <view class="cart-item" v-for="(item, index) in cartList" :key="item.id">
        <!-- 选择按钮 -->
        <view class="select-btn" @click="toggleSelect(index)">
          <uni-icons
            :type="item.selected ? 'checkbox-filled' : 'circle'"
            :color="item.selected ? '#27ba9b' : '#ccc'"
            size="24"
          />
        </view>

        <!-- 商品图片 -->
        <image
          class="goods-image"
          :src="item.imgUrl"
          mode="aspectFill"
          @click="gotoDetail(item.goodId)"
        />

        <!-- 商品信息 -->
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-desc">{{ item.desc }}</text>
          <view class="price-section">
            <text class="goods-price">¥{{ item.price }}</text>
            <view class="count-control">
              <button class="count-btn minus" @click.stop="changeCount(index, 'minus')">-</button>
              <text class="count">{{ item.count }}</text>
              <button class="count-btn add" @click.stop="changeCount(index, 'add')">+</button>
            </view>
          </view>
        </view>

        <!-- 删除按钮 -->
        <view class="delete-btn" @click="deleteItem(index)">
          <uni-icons type="trash" size="20" color="#999" />
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="cartList.length === 0">
        <image class="empty-image" src="/static/images/empty-cart.png" />
        <text class="empty-text">购物车空空如也~</text>
        <button class="empty-btn" @click="uni.switchTab({ url: '/pages/index/index' })">
          去逛逛
        </button>
      </view>
    </scroll-view>

    <!-- 底部结算栏 -->
    <view class="checkout-bar" v-if="cartList.length > 0">
      <view class="select-all" @click="toggleAllSelect">
        <uni-icons
          :type="allSelected ? 'checkbox-filled' : 'circle'"
          :color="allSelected ? '#27ba9b' : '#ccc'"
          size="24"
        />
        <text>全选</text>
      </view>

      <view class="total-price">
        <text>合计:</text>
        <text class="price">¥{{ totalPrice }}</text>
      </view>

      <button class="checkout-btn" @click="checkout">
        结算({{ cartList.filter((item) => item.selected).length }})
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cart-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .cart-list {
    flex: 1;
    padding-bottom: 100rpx;

    .cart-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      margin: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;

      .select-btn {
        width: 80rpx;
        display: flex;
        justify-content: center;
      }

      .goods-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
      }

      .goods-info {
        flex: 1;
        margin-left: 20rpx;
        height: 160rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods-name {
          font-size: 28rpx;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .goods-desc {
          font-size: 24rpx;
          color: #999;
          margin: 10rpx 0;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .goods-price {
            font-size: 32rpx;
            color: #ff5c5c;
            font-weight: bold;
          }

          .count-control {
            display: flex;
            align-items: center;

            .count-btn {
              width: 50rpx;
              height: 50rpx;
              line-height: 50rpx;
              text-align: center;
              font-size: 32rpx;
              color: #666;
              background-color: #f5f5f5;
              border-radius: 50%;
              padding: 0;
              margin: 0;

              &.add {
                color: #27ba9b;
              }
            }

            .count {
              width: 60rpx;
              text-align: center;
              font-size: 28rpx;
            }
          }
        }
      }

      .delete-btn {
        width: 60rpx;
        display: flex;
        justify-content: center;
      }
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 100rpx;

      .empty-image {
        width: 300rpx;
        height: 300rpx;
        margin-bottom: 30rpx;
      }

      .empty-text {
        font-size: 28rpx;
        color: #999;
        margin-bottom: 40rpx;
      }

      .empty-btn {
        width: 200rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 28rpx;
        color: #fff;
        background-color: #27ba9b;
        border-radius: 35rpx;
      }
    }
  }

  .checkout-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    padding: 0 20rpx;

    .select-all {
      display: flex;
      align-items: center;
      margin-right: 20rpx;

      text {
        margin-left: 10rpx;
        font-size: 28rpx;
      }
    }

    .total-price {
      flex: 1;
      text-align: right;
      font-size: 28rpx;

      .price {
        font-size: 32rpx;
        color: #ff5c5c;
        font-weight: bold;
        margin-left: 10rpx;
      }
    }

    .checkout-btn {
      width: 200rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 35rpx;
      margin-left: 20rpx;
    }
  }
}
</style>
