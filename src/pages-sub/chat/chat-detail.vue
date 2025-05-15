<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getMessageAPI, sendMessageAPI } from '@/api/chat'
import type { GetMessageDatum } from '@/types/chat'
import { formatTime } from '@/utils/time'
import { useMemberStore } from '@/stores/member'
import { onLoad } from '@dcloudio/uni-app'

const messages = ref<GetMessageDatum[]>([])
const inputMessage = ref('')
const sessionId = ref('')
const contactName = ref('')
const contactId = ref(0)

const scrollRef = ref<any>(null)
const memberStore = useMemberStore()

onLoad((options) => {
  //@ts-ignore
  const { sessionId: sId, contactName: cName, contactId: cId } = options
  // 合并日志输出
  console.log('LHG:chat/chat-detail.vue onLoad 参数:', { sId, cName, cId })

  // 赋值到响应式变量
  sessionId.value = sId
  contactName.value = cName
  contactId.value = cId
  loadMessages()
})

// 滚动到底部的方法
const scrollToBottom = () => {
  const scrollView = uni.createSelectorQuery().select('.message-list')
  scrollView
    .boundingClientRect((rect) => {
      if (rect && !Array.isArray(rect)) {
        uni.pageScrollTo({
          scrollTop: rect.height,
          duration: 300,
        })
      }
    })
    .exec()
}

// 加载消息记录
const loadMessages = async () => {
  if (!sessionId.value) return
  const res = await getMessageAPI({ sessionId: sessionId.value })
  if (res.code === 0) {
    messages.value = res.data
    // 加载完消息后延迟滚动到底部
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const params = {
    sessionId: sessionId.value,
    message: inputMessage.value,
    toUser: messages.value[0]?.contactId || contactId.value,
  }

  const res = await sendMessageAPI(params)
  if (res.code === 0) {
    inputMessage.value = ''
    await loadMessages() // 重新加载消息并自动滚动
  }
}
</script>

<template>
  <view class="chat-detail">
    <view class="header">
      <text class="contact-name">{{ contactName }}</text>
    </view>

    <scroll-view
      class="message-list"
      scroll-y
      :scroll-into-view="'msg-' + messages[messages.length - 1]?.messageId"
      :scroll-with-animation="true"
    >
      <view
        v-for="msg in messages"
        :key="msg.messageId"
        :id="'msg-' + msg.messageId"
        :class="['message-item', msg.sendUserId === memberStore.profile?.id ? 'self' : 'other']"
      >
        <view class="avatar-wrapper">
          <image class="avatar" src="/static/images/default-avatar.png" mode="aspectFill" />
          <text class="sender-name">{{
            msg.sendUserId === memberStore.profile?.id ? memberStore.profile.nickname : contactName
          }}</text>
        </view>
        <view class="message-content">
          <text class="text">{{ msg.messageContent }}</text>
          <text class="time">{{ formatTime(msg.sendTime) }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <input type="text" v-model="inputMessage" placeholder="请输入消息" @confirm="sendMessage" />
      <button @tap="sendMessage" :disabled="!inputMessage.trim()">发送</button>
    </view>
  </view>
</template>

<style lang="scss">
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;

  .header {
    background-color: #fff;
    padding: 20rpx 30rpx;
    text-align: center;
    border-bottom: 1rpx solid #eee;

    .contact-name {
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  .message-list {
    .message-item {
      display: flex;
      margin-bottom: 30rpx;
      align-items: flex-start; // 修改为顶部对齐

      &.self {
        flex-direction: row-reverse;

        .avatar-wrapper {
          margin-left: 20rpx;
          margin-right: 0;
          align-items: flex-end; // 自己发送的消息,名字靠右

          .sender-name {
            text-align: right;
          }
        }

        .message-content {
          margin-right: 0;
          margin-left: 20rpx;
          background-color: #007aff;

          .text {
            color: #fff;
          }

          .time {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }

      .avatar-wrapper {
        display: flex;
        flex-direction: column;
        margin-right: 20rpx;
        min-width: 80rpx;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-bottom: 8rpx;
        }

        .sender-name {
          font-size: 24rpx;
          color: #999;
          line-height: 1;
        }
      }

      .message-content {
        background: #fff;
        padding: 28rpx 32rpx;
        border-radius: 24rpx;
        position: relative;
        max-width: 70%;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
        margin-bottom: 4rpx;

        .text {
          font-size: 30rpx;
          color: #333;
          word-break: break-all;
          margin-bottom: 10rpx;
          line-height: 1.6;
        }

        .time {
          font-size: 22rpx;
          color: #bbb;
          display: block;
          align-self: flex-end;
        }
      }
    }
  }

  .input-area {
    padding: 20rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    align-items: center;

    input {
      flex: 1;
      height: 80rpx;
      background-color: #f5f5f5;
      border-radius: 40rpx;
      padding: 0 30rpx;
      margin-right: 20rpx;
      font-size: 28rpx;
    }

    button {
      width: 120rpx;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #007aff;
      color: #fff;
      font-size: 28rpx;
      border-radius: 40rpx;
      padding: 0;

      &:disabled {
        background-color: #ccc;
      }
    }
  }
}
</style>
