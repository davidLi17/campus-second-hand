// src/types/uni-app.d.ts
import '@dcloudio/uni-app'

declare module '@dcloudio/uni-app' {
  interface PageInstance {
    getOpenerEventChannel(): EventChannel
  }

  interface EventChannel {
    emit(eventName: string, args?: any): void
    on(eventName: string, callback: (...args: any[]) => void): void
    off(eventName: string, callback: (...args: any[]) => void): void
  }
}
