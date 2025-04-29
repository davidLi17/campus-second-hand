<script setup lang="ts">
interface MessageItem {
  type: 'notification' | 'interaction' | 'chat'
  avatar: string
  name: string
  lastMessage: string
  time: string
  unread?: number
  tag?: string
}

const messageList: MessageItem[] = [
  {
    type: 'notification',
    avatar: '/static/notification-icon.png',
    name: '通知消息',
    lastMessage: '大额优惠劵等你来抢',
    time: '03-28',
    unread: 2,
    tag: '服务号',
  },
  {
    type: 'interaction',
    avatar: '/static/interaction-icon.png',
    name: '互动消息',
    lastMessage: '还没有新通知~',
    time: '今天',
  },
  {
    type: 'chat',
    avatar: '/static/default-avatar.png',
    name: '爱吃猫的鱼',
    lastMessage: '这个商品还在吗？',
    time: '12:30',
    unread: 2,
  },
]
</script>

<template>
  <view class="message-page">
    <!-- Header -->
    <view class="header">
      <view class="title-bar">
        <text class="title">消息</text>
        <view class="clear-btn">
          <text>清除未读</text>
        </view>
      </view>
      <!-- Search Bar -->
      <view class="search-bar">
        <text class="iconfont icon-search"></text>
        <input type="text" placeholder="搜索聊天记录/联系人/服务号" />
      </view>
    </view>

    <!-- Message List -->
    <view class="message-list">
      <view
        class="message-item"
        v-for="(item, index) in messageList"
        :key="index"
        :class="item.type"
      >
        <image class="avatar" :src="item.avatar" mode="aspectFill" />
        <view class="content">
          <view class="top-line">
            <view class="name-wrap">
              <text class="name">{{ item.name }}</text>
              <text v-if="item.tag" class="tag">{{ item.tag }}</text>
            </view>
            <text class="time">{{ item.time }}</text>
          </view>
          <view class="bottom-line">
            <text class="last-message">{{ item.lastMessage }}</text>
            <view class="unread" v-if="item.unread">{{ item.unread }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.message-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .header {
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    position: sticky;
    top: 0;
    z-index: 100;

    .title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .title {
        font-size: 36rpx;
        font-weight: bold;
      }

      .clear-btn {
        font-size: 26rpx;
        color: #666;
      }
    }

    .search-bar {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 36rpx;
      padding: 15rpx 30rpx;

      .icon-search {
        font-size: 28rpx;
        color: #999;
        margin-right: 10rpx;
      }

      input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .message-list {
    .message-item {
      display: flex;
      padding: 30rpx;
      background-color: #ffffff;
      border-bottom: 1rpx solid #f5f5f5;

      &.notification {
        background-color: #fff9f9;
      }

      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .content {
        flex: 1;

        .top-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10rpx;

          .name-wrap {
            display: flex;
            align-items: center;

            .name {
              font-size: 30rpx;
              color: #333;
              margin-right: 10rpx;
            }

            .tag {
              font-size: 22rpx;
              color: #999;
              background-color: #f5f5f5;
              padding: 2rpx 10rpx;
              border-radius: 4rpx;
            }
          }

          .time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .bottom-line {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .last-message {
            font-size: 28rpx;
            color: #666;
          }

          .unread {
            background-color: #ff5000;
            color: #fff;
            font-size: 24rpx;
            min-width: 36rpx;
            height: 36rpx;
            border-radius: 18rpx;
            text-align: center;
            padding: 0 8rpx;
          }
        }
      }
    }
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #666;
      font-size: 24rpx;

      &.active {
        color: #ff5000;
      }

      .iconfont {
        font-size: 40rpx;
        margin-bottom: 4rpx;
      }
    }
  }
}
</style>
