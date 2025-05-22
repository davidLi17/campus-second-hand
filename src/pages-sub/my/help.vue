<script setup lang="ts">
import { ref } from 'vue'

// 搜索关键词
const searchKeyword = ref('')

// 常见问题分类
const categories = ref([
  { id: 1, name: '账号问题', icon: 'person' },
  { id: 2, name: '交易流程', icon: 'shop' },
  { id: 3, name: '支付问题', icon: 'wallet' },
  { id: 4, name: '商品发布', icon: 'plus' },
  { id: 5, name: '物流配送', icon: 'paperplane' },
  { id: 6, name: '售后服务', icon: 'service' },
])

// 常见问题列表
const faqs = ref([
  {
    id: 1,
    categoryId: 1,
    question: '如何注册账号？',
    answer:
      '1. 点击首页"我的"按钮\n2. 选择"注册"选项\n3. 输入校园邮箱和设置密码\n4. 完成邮箱验证即可注册成功',
  },
  {
    id: 2,
    categoryId: 1,
    question: '忘记密码怎么办？',
    answer:
      '1. 在登录页面点击"忘记密码"\n2. 输入注册时使用的校园邮箱\n3. 按照邮件提示重置密码\n4. 使用新密码登录',
  },
  {
    id: 3,
    categoryId: 2,
    question: '如何购买商品？',
    answer:
      '1. 浏览商品详情页\n2. 点击"立即购买"或"加入购物车"\n3. 确认订单信息\n4. 选择支付方式完成支付',
  },
  {
    id: 4,
    categoryId: 2,
    question: '如何与卖家沟通？',
    answer:
      '1. 在商品详情页点击"联系卖家"\n2. 通过平台内置聊天功能交流\n3. 可以询问商品详情、议价等',
  },
  {
    id: 5,
    categoryId: 3,
    question: '支持哪些支付方式？',
    answer: '目前支持：\n- 校园一卡通支付\n- 微信支付\n- 支付宝\n- 平台余额支付',
  },
  {
    id: 6,
    categoryId: 4,
    question: '如何发布商品？',
    answer:
      '1. 点击首页底部"+"按钮\n2. 填写商品信息(标题、描述、价格等)\n3. 上传清晰商品图片\n4. 选择商品分类\n5. 点击"发布"按钮',
  },
  {
    id: 7,
    categoryId: 5,
    question: '如何安排取货/送货？',
    answer:
      '平台提供两种方式：\n1. 校内自提：买卖双方约定地点时间\n2. 校园配送：使用校园快递服务(需额外支付配送费)',
  },
  {
    id: 8,
    categoryId: 6,
    question: '商品有问题如何退货？',
    answer:
      '1. 在"我的订单"中找到对应订单\n2. 点击"申请售后"\n3. 选择退货原因并上传凭证\n4. 与卖家协商退货方式\n5. 卖家确认后完成退款',
  },
])

// 当前选中的分类ID
const activeCategory = ref(0)

// 过滤问题列表
const filteredFaqs = computed(() => {
  if (activeCategory.value === 0) {
    return faqs.value
  }
  return faqs.value.filter((item) => item.categoryId === activeCategory.value)
})

// 搜索问题
const searchResults = computed(() => {
  if (!searchKeyword.value) return []
  return faqs.value.filter(
    (item) =>
      item.question.includes(searchKeyword.value) || item.answer.includes(searchKeyword.value),
  )
})

// 展开的问题ID
const expandedFaqId = ref(0)

// 切换问题展开状态
const toggleFaq = (id: number) => {
  expandedFaqId.value = expandedFaqId.value === id ? 0 : id
}
</script>

<template>
  <view class="help-center">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">帮助中心</text>
      <text class="subtitle">有任何问题都可以在这里找到答案</text>
    </view>

    <!-- 搜索框 -->
    <view class="search-bar">
      <uni-icons type="search" size="18" color="#999" />
      <input
        v-model="searchKeyword"
        class="search-input"
        placeholder="搜索问题关键词"
        placeholder-style="color:#999;"
      />
    </view>

    <!-- 搜索结果 -->
    <view v-if="searchKeyword" class="search-results">
      <text class="section-title">搜索结果</text>
      <view v-if="searchResults.length > 0">
        <view
          v-for="item in searchResults"
          :key="item.id"
          class="faq-item"
          @click="toggleFaq(item.id)"
        >
          <view class="faq-question">
            <text>{{ item.question }}</text>
            <uni-icons
              :type="expandedFaqId === item.id ? 'minus' : 'plus'"
              size="16"
              color="#666"
            />
          </view>
          <view v-if="expandedFaqId === item.id" class="faq-answer">
            <text>{{ item.answer }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-result">
        <text>没有找到相关问题，请联系客服</text>
      </view>
    </view>

    <!-- 常见问题分类 -->
    <view v-else>
      <text class="section-title">常见问题分类</text>
      <scroll-view class="category-list" scroll-x>
        <view
          v-for="item in categories"
          :key="item.id"
          :class="['category-item', { active: activeCategory === item.id }]"
          @click="activeCategory = item.id"
        >
          <uni-icons :type="item.icon" size="24" />
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>

      <!-- 问题列表 -->
      <text class="section-title">常见问题</text>
      <view class="faq-list">
        <view
          v-for="item in filteredFaqs"
          :key="item.id"
          class="faq-item"
          @click="toggleFaq(item.id)"
        >
          <view class="faq-question">
            <text>{{ item.question }}</text>
            <uni-icons
              :type="expandedFaqId === item.id ? 'minus' : 'plus'"
              size="16"
              color="#666"
            />
          </view>
          <view v-if="expandedFaqId === item.id" class="faq-answer">
            <text>{{ item.answer }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系客服 -->
    <view class="contact-service">
      <text class="section-title">仍然需要帮助？</text>
      <button class="contact-btn">
        <uni-icons type="service" size="18" />
        <text>联系客服</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.help-center {
  padding: 20rpx 30rpx;
  background-color: #f7f7f7;
  min-height: 100vh;

  .header {
    margin-bottom: 30rpx;

    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      display: block;
    }

    .subtitle {
      font-size: 26rpx;
      color: #999;
      margin-top: 10rpx;
      display: block;
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .search-input {
      flex: 1;
      margin-left: 20rpx;
      font-size: 28rpx;
    }
  }

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin: 30rpx 0 20rpx;
    display: block;
  }

  .category-list {
    white-space: nowrap;
    margin-bottom: 20rpx;

    .category-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      height: 160rpx;
      background-color: #fff;
      border-radius: 16rpx;
      margin-right: 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      text {
        margin-top: 15rpx;
        font-size: 26rpx;
        color: #666;
      }

      &.active {
        background-color: #27ba9b;

        text,
        uni-icons {
          color: #fff;
        }
      }
    }
  }

  .faq-list,
  .search-results {
    margin-bottom: 30rpx;

    .faq-item {
      background-color: #fff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      padding: 30rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;
        color: #333;
      }

      .faq-answer {
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #f5f5f5;
        font-size: 28rpx;
        color: #666;
        white-space: pre-line;
      }
    }

    .empty-result {
      text-align: center;
      padding: 60rpx 0;
      color: #999;
      font-size: 28rpx;
    }
  }

  .contact-service {
    text-align: center;
    margin: 50rpx 0;

    .contact-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 240rpx;
      height: 80rpx;
      background-color: #27ba9b;
      color: #fff;
      border-radius: 40rpx;
      font-size: 28rpx;
      margin-top: 20rpx;

      uni-icons {
        margin-right: 10rpx;
      }
    }
  }
}
</style>
