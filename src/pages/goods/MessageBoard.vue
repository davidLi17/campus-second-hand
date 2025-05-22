<!-- src/components/MessageBoard.vue -->
<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { productMessageApi } from '@/api/user_goods'
import { useMemberStore } from '@/stores/member'

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
  initialMessages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['message-submitted', 'message-deleted'])

const memberStore = useMemberStore()

// 留言数据
const messages = ref<any[]>(props.initialMessages)
const newMessage = ref('')
const messageLoading = ref(false)

// 回复状态管理
const replyState = reactive({
  active: false,
  messageId: null as number | null,
  username: '',
  content: '',
  focused: false,
})

// 计算当前输入内容
const currentMessage = computed({
  get: () => (replyState.active ? replyState.content : newMessage.value),
  set: (value) => {
    if (replyState.active) {
      replyState.content = value
    } else {
      newMessage.value = value
    }
  },
})

// 获取留言列表
const fetchMessages = async () => {
  try {
    messageLoading.value = true
    const res = await productMessageApi.getAllMessages(props.productId)
    if (res.code === 0) {
      messages.value = res.data
      emit('message-submitted')
    }
  } catch (error) {
    console.error('获取留言失败:', error)
    uni.showToast({
      title: '获取留言失败',
      icon: 'none',
    })
  } finally {
    messageLoading.value = false
  }
}

// 提交留言或回复
const submitMessage = async () => {
  const content = replyState.active ? replyState.content : newMessage.value
  if (!content.trim() || !props.productId) return

  try {
    const params = {
      productID: props.productId,
      messageContent: content,
      parentId: replyState.active ? replyState.messageId : undefined,
      isRespond: replyState.active ? 1 : 0,
    }

    const res = await productMessageApi.addMessage(params)

    if (res.code === 0) {
      uni.showToast({
        title: replyState.active ? '回复成功' : '留言成功',
        icon: 'success',
      })
      resetInputState()
      await fetchMessages()
    }
  } catch (error) {
    console.error('操作失败:', error)
    uni.showToast({
      title: replyState.active ? '回复失败' : '留言失败',
      icon: 'none',
    })
  }
}

// 回复留言
const replyMessage = async (messageId: number, username: string) => {
  replyState.active = true
  replyState.messageId = messageId
  replyState.username = username
  replyState.content = `回复 ${username}: `
  replyState.focused = true

  await nextTick()

  // 滚动到输入框
  uni.pageScrollTo({
    selector: '#message-input-container',
    duration: 300,
    success: () => {
      // 确保聚焦
      replyState.focused = true
    },
  })
}

// 取消回复
const cancelReply = () => {
  resetInputState()
}

// 删除留言
const deleteMessage = async (messageId: number) => {
  try {
    const { confirm } = await uni.showModal({
      title: '确认删除',
      content: '确定要删除这条留言吗？',
      confirmColor: '#e64340',
    })

    if (!confirm) return

    const res = await productMessageApi.deleteMessage({ messageId })
    if (res.code === 0) {
      uni.showToast({ title: '删除成功', icon: 'success' })
      await fetchMessages()
      emit('message-deleted')
    }
  } catch (error) {
    console.error('删除留言失败:', error)
    uni.showToast({
      title: '删除留言失败',
      icon: 'none',
    })
  }
}

// 重置输入状态
const resetInputState = () => {
  replyState.active = false
  replyState.messageId = null
  replyState.username = ''
  replyState.content = ''
  replyState.focused = false
  newMessage.value = ''
}

// 初始化加载留言
fetchMessages()
</script>

<template>
  <view class="message-section">
    <text class="section-title">商品留言</text>

    <!-- 回复提示 -->
    <view v-if="replyState.active" class="reply-hint">
      <text>正在回复 {{ replyState.username }}</text>
      <button class="cancel-btn" @click="cancelReply">取消</button>
    </view>

    <!-- 留言列表 -->
    <view v-if="messageLoading" class="message-loading">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <view v-else-if="messages.length > 0" class="message-list">
      <view v-for="message in messages" :key="message.id" class="message-item">
        <view class="message-header">
          <image
            class="avatar"
            :src="message.avatar || '/static/images/default-avatar.png'"
            mode="aspectFill"
          />
          <text class="username">{{ message.username || '匿名用户' }}</text>
          <text class="time">{{ message.createTime }}</text>

          <!-- 删除按钮（仅限自己的留言） -->
          <button
            v-if="memberStore.profile?.id === message.userId"
            class="delete-btn"
            @click="deleteMessage(message.id)"
          >
            删除
          </button>
        </view>

        <view class="message-content">
          {{ message.messageContent }}
        </view>

        <!-- 回复按钮 -->
        <button class="reply-btn" @click="replyMessage(message.id, message.username)">回复</button>

        <!-- 回复列表 -->
        <view v-if="message.replies?.length" class="replies">
          <view v-for="reply in message.replies" :key="reply.id" class="reply-item">
            <view class="reply-header">
              <image
                class="avatar"
                :src="reply.avatar || '/static/images/default-avatar.png'"
                mode="aspectFill"
              />
              <text class="username">{{ reply.username || '匿名用户' }}</text>
              <text class="time">{{ reply.createTime }}</text>
            </view>
            <view class="reply-content">
              {{ reply.messageContent }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-message">
      <text>暂无留言，快来发表第一条留言吧~</text>
    </view>

    <!-- 留言输入框容器 -->
    <view id="message-input-container" class="input-container">
      <!-- 普通留言输入框 -->
      <view v-if="!replyState.active" class="message-input">
        <input
          v-model="newMessage"
          class="input"
          placeholder="说点什么..."
          confirm-type="send"
          @confirm="submitMessage"
        />
        <button class="submit-btn" @click="submitMessage">发送</button>
      </view>

      <!-- 回复输入框 -->
      <view v-else class="reply-input">
        <input
          v-model="replyState.content"
          :focus="replyState.focused"
          class="input"
          :placeholder="`回复 ${replyState.username}`"
          confirm-type="send"
          @confirm="submitMessage"
          @blur="replyState.focused = false"
        />
        <button class="cancel-btn" @click="cancelReply">取消</button>
        <button class="submit-btn" @click="submitMessage">发送</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.message-section {
  padding: 30rpx;
  margin: 20rpx 0;
  background-color: #fff;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }

  .reply-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 20rpx;
    margin-bottom: 20rpx;
    background-color: #f7f7f7;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #666;

    .cancel-btn {
      padding: 0 20rpx;
      height: 50rpx;
      line-height: 50rpx;
      font-size: 24rpx;
      color: #999;
      background-color: transparent;
    }
  }

  .message-loading {
    padding: 40rpx 0;
    display: flex;
    justify-content: center;
  }

  .message-list {
    .message-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      .message-header {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        .avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          margin-right: 16rpx;
        }

        .username {
          font-size: 28rpx;
          color: #333;
          margin-right: 16rpx;
        }

        .time {
          font-size: 24rpx;
          color: #999;
          flex: 1;
        }

        .delete-btn {
          padding: 0 20rpx;
          height: 50rpx;
          line-height: 50rpx;
          font-size: 24rpx;
          color: #e64340;
          border: 1rpx solid #e64340;
          border-radius: 25rpx;
          background-color: #fff;
        }
      }

      .message-content {
        font-size: 28rpx;
        color: #333;
        margin-left: 76rpx;
        margin-bottom: 16rpx;
      }

      .reply-btn {
        margin-left: 76rpx;
        padding: 0 20rpx;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 24rpx;
        color: #666;
        border: 1rpx solid #ddd;
        border-radius: 25rpx;
        background-color: #fff;
      }

      .replies {
        margin-top: 20rpx;
        padding-left: 76rpx;
        border-left: 2rpx solid #eee;

        .reply-item {
          padding: 20rpx 0;
          border-bottom: 1rpx dashed #eee;

          .reply-header {
            display: flex;
            align-items: center;
            margin-bottom: 10rpx;

            .avatar {
              width: 50rpx;
              height: 50rpx;
              border-radius: 50%;
              margin-right: 16rpx;
            }

            .username {
              font-size: 26rpx;
              color: #666;
              margin-right: 16rpx;
            }

            .time {
              font-size: 22rpx;
              color: #999;
            }
          }

          .reply-content {
            font-size: 26rpx;
            color: #666;
            padding-left: 66rpx;
          }
        }
      }
    }
  }

  .empty-message {
    padding: 40rpx 0;
    text-align: center;
    font-size: 28rpx;
    color: #999;
  }

  .input-container {
    margin-top: 30rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f5f5f5;
  }

  .message-input,
  .reply-input {
    display: flex;
    align-items: center;

    .input {
      flex: 1;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #f7f7f7;
      border-radius: 40rpx;
      font-size: 28rpx;
    }

    .cancel-btn {
      width: 120rpx;
      height: 80rpx;
      line-height: 80rpx;
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #666;
      background-color: #fff;
      border-radius: 40rpx;
      border: 1rpx solid #ddd;
    }

    .submit-btn {
      width: 120rpx;
      height: 80rpx;
      line-height: 80rpx;
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 40rpx;
    }
  }
}
</style>
