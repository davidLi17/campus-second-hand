/* eslint-env node */  // 指定代码运行环境为Node.js环境
require('@rushstack/eslint-patch/modern-module-resolution')  // 引入eslint补丁以支持现代模块解析

// 导出ESLint配置对象
module.exports = {
  root: true,  // 表示这是根配置文件，ESLint将停止在父级目录中查找其他配置文件

  // 继承的基础配置集合
  extends: [
    'plugin:vue/vue3-essential',  // Vue3基础语法规则
    'eslint:recommended',  // ESLint官方推荐规则
    '@vue/eslint-config-typescript',  // Vue项目的TypeScript支持
    '@vue/eslint-config-prettier',  // 解决Prettier和ESLint的格式冲突
  ],

  // 定义全局变量（主要用于小程序开发环境）
  globals: {
    uni: true,  // uni-app框架全局对象
    wx: true,  // 微信小程序全局对象
    WechatMiniprogram: true,  // 微信小程序类型定义
    getCurrentPages: true,  // 获取当前页面栈的方法
    getApp: true,  // 获取App实例的方法
    UniApp: true,  // uni-app类型定义
    UniHelper: true,  // uni-app辅助工具
    App: true,  // 小程序App构造器
    Page: true,  // 小程序Page构造器
    Component: true,  // 小程序Component构造器
    AnyObject: true,  // 任意对象类型声明
  },

  // 解析器配置选项
  parserOptions: {
    ecmaVersion: 'latest',  // 使用最新的ECMAScript语法标准
  },

  // 自定义规则配置
  rules: {
    // Prettier格式化规则配置
    'prettier/prettier': [
      'warn',  // 违反规则时显示警告
      {
        singleQuote: true,  // 使用单引号
        semi: false,  // 语句末尾加分号
        printWidth: 100,  // 每行最大字符数
        trailingComma: 'all',  // 多行时始终添加尾随逗号
        endOfLine: 'auto',  // 自动识别换行符
      },
    ],
    'vue/multi-word-component-names': ['off'],  // 关闭Vue组件名必须多单词的要求
    'vue/no-setup-props-destructure': ['off'],  // 允许在setup中解构props
    'vue/no-deprecated-html-element-is': ['off'],  // 允许使用已废弃的is属性
    '@typescript-eslint/no-unused-vars': ['off'],  // 关闭未使用变量的检查
  },
}
