<template>
  <div class="qiugou">求购商品列表</div>
</template>

<script lang="ts" setup>
import type Api from '@/types/index.d.ts'
import { PurchaseGoodsGetAll } from '@/services/services.ts'
import { responseCode } from '@/types/schema.ts'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const goodsList = ref<Api.Paths.AGetPurchase.Response>([])

async function fetchGoodsList() {
  const response = await PurchaseGoodsGetAll()
  if (response.code === responseCode.SUCCESS) {
    goodsList.value = response.data
  } else {
    uni.showToast({
      title: '获取商品列表失败',
      icon: 'none',
    })
    goodsList.value = [
      {
        id: 1,
        userId: 1001, // 不同用户ID，模拟不同用户
        name: '林小羽', // 真实中文名，男女混合
        desc: '简约款白色卫衣，纯棉材质，适合春秋穿搭', // 具体描述，贴近业务场景
        price: 199.99, // 价格带小数点，符合商品定价习惯
        sort: 8, // 排序值合理波动（比如热门商品排序靠前）
        count: 150, // 库存数量，热销商品库存较高
        status: 1, // 状态码（0=下架，1=在售，2=预售）
        transaction: 897, // 交易次数，热销商品销量高
        image: 'https://example.com/image1.jpg', // 保留image字段，暂时用占位符
        createTime: 1695897744000, // 创建时间合理（当前时间附近的时间戳）
        updateTime: 1695984144000, // 更新时间晚于创建时间，模拟数据更新
      },
      {
        id: 2,
        userId: 1002,
        name: '张欣然',
        desc: '复古风牛仔裤，高腰设计，显瘦百搭',
        price: 299.5, // 价格多样化（可整数或小数）
        sort: 3, // 排序更靠前，代表热门商品
        count: 200, // 库存充足
        status: 1, // 在售状态
        transaction: 1205, // 销量更高
        image: 'https://example.com/image2.jpg',
        createTime: 1695921600000, // 按时间顺序生成
        updateTime: 1695984144000, // 统一最新更新时间，模拟批量更新
      },
      {
        id: 3,
        userId: 1003,
        name: '陈雨浩',
        desc: '运动款蓝牙耳机，降噪功能，续航12小时',
        price: 599.0, // 整数价格，适合数码产品
        sort: 15, // 排序中等
        count: 50, // 库存较低，模拟缺货预警
        status: 0, // 下架状态（库存不足自动下架）
        transaction: 300, // 销量一般
        image: 'https://example.com/image3.jpg',
        createTime: 1695811200000, // 更早的创建时间
        updateTime: 1695811200000, // 未更新过
      },
      {
        id: 4,
        userId: 1004,
        name: '李诗雨',
        desc: '大容量双肩背包，防水面料，适合学生党',
        price: 159.8, // 低价商品
        sort: 20, // 排序靠后
        count: 300, // 库存充足
        status: 1, // 在售
        transaction: 500, // 中等销量
        image: 'https://example.com/image4.jpg',
        createTime: 1695964800000, // 近期创建
        updateTime: 1695964800000, // 未更新
      },
      {
        id: 5,
        userId: 1005,
        name: '王宇航',
        desc: '智能手表，血氧监测，长续航15天',
        price: 1299.99, // 高价商品
        sort: 5, // 排序靠前（主推商品）
        count: 80, // 库存中等
        status: 2, // 预售状态（新品未上架）
        transaction: 50, // 预售订单少
        image: 'https://example.com/image5.jpg',
        createTime: 1696051200000, // 未来时间（预售商品）
        updateTime: 1696051200000, // 未更新
      },
    ]
  }
}

onLoad(() => {
  // fetchGoodsList()
})
</script>

<style lang="scss"></style>
