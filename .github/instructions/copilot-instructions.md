---
applyTo: '**/*.vue,**/*.ts'
---

## 核心框架

- Vue 3.2.47
- TypeScript 5.1.6
- uni-app 3.0
- Pinia 2.0.27 (状态管理)

## UI 组件

- @dcloudio/uni-ui 1.5.7

## 代码规范

### 1. 文件组织

- 页面文件放在 `pages` 目录下
- 组件文件放在 `components` 目录下
- API 请求放在 `api` 目录下
- 类型定义放在 `types` 目录下
- 工具函数放在 `utils` 目录下

### 2. TypeScript 规范

- 必须明确声明类型，避免使用 any,如果类型报错严重可以使用 any
- 使用 interface 而不是 type 定义对象类型
- 使用 enum 定义常量枚举

### 3. Vue 组件规范

- 使用 `<script setup lang="ts">`
- Props 必须声明类型和默认值
- Emit 必须在 defineEmits 中声明
- 使用 composition API 组织代码

### 5. 样式规范

- 使用 SCSS 预处理器
- 遵循 BEM 命名规范
- 优先使用 uni-app 内置样式类

### 4. 状态管理

- 使用 Pinia 进行状态管理
- Store 必须使用 TypeScript
- 复杂数据需要做持久化处理
