<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSessionAPI } from '@/api/chat'
import type { GetSessionDatum } from '@/types/chat'
import { formatTime } from '@/utils/time.ts' // 假设有一个时间格式化工具

const sessionList = ref<GetSessionDatum[]>([])

// 获取会话列表
const loadSessions = async () => {
  const res = await getSessionAPI()
  if (res.code === 0) {
    sessionList.value = res.data
  }
}

const navigateToChat = (session: GetSessionDatum) => {
  uni.navigateTo({
    url: `/pages-sub/chat/chat-detail?sessionId=${session.sessionId}&contactName=${session.contactName}&contactId=${session.contactId}`,
  })
}

onMounted(() => {
  loadSessions()
})
</script>

<template>
  <view class="chat-list">
    <view class="header">
      <text class="title">消息</text>
    </view>

    <view class="session-list">
      <view
        class="session-item"
        v-for="session in sessionList"
        :key="session.sessionId"
        @tap="navigateToChat(session)"
      >
        <view class="avatar-wrapper">
          <image class="avatar" src="/static/images/default-avatar.png" mode="aspectFill" />
          <!-- 暂时移除未读消息徽章，因为接口暂不支持 -->
          <!-- <view v-if="session.unreadCount && session.unreadCount > 0" class="unread-badge">
            {{ session.unreadCount > 99 ? '99+' : session.unreadCount }}
          </view> -->
        </view>
        <view class="content">
          <view class="top-line">
            <text class="name">{{ session.contactName }}</text>
            <text class="time">{{ formatTime(session.lastUpdateDate) }}</text>
          </view>
          <view class="bottom-line">
            <text class="last-message">点击开始聊天</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.chat-list {
  background-color: #f7f7f7;
  min-height: 100vh;

  .header {
    background-color: #fff;
    padding: 32rpx 32rpx 16rpx 32rpx;
    border-bottom: 1rpx solid #ededed;
    position: sticky;
    top: 0;
    z-index: 1;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #222;
      letter-spacing: 1rpx;
    }
  }

  .session-list {
    .session-item {
      display: flex;
      align-items: center;
      padding: 28rpx 32rpx;
      background-color: #fff;
      border-bottom: 1rpx solid #f0f0f0;
      transition: background-color 0.2s;

      &:active {
        background-color: #f5f5f5;
      }

      .avatar-wrapper {
        position: relative;
        margin-right: 24rpx;

        .avatar {
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
          background-color: #f0f0f0;
          border: 1rpx solid #ececec;
        }

        .unread-badge {
          position: absolute;
          top: -8rpx;
          right: -8rpx;
          min-width: 32rpx;
          height: 32rpx;
          padding: 0 8rpx;
          border-radius: 32rpx;
          background-color: #ff3b30;
          color: #fff;
          font-size: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.12);
        }
      }

      .content {
        flex: 1;
        overflow: hidden;
        min-width: 0;

        .top-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8rpx;

          .name {
            font-size: 30rpx;
            color: #222;
            font-weight: 500;
            max-width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .time {
            font-size: 22rpx;
            color: #bbb;
            margin-left: 16rpx;
            flex-shrink: 0;
          }
        }

        .bottom-line {
          .last-message {
            font-size: 26rpx;
            color: #888;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            max-width: 100%;
          }
        }
      }
    }
  }
}
</style>
