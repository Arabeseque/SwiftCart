import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 导入 Material Icons
import '@material/web/icon/icon'
import '@material/web/iconbutton/icon-button'

// 导入 UnoCSS 样式
import 'uno.css'
// 导入 Material Design 基础样式
import './styles/material.css'

// 创建应用实例
const app = createApp(App)

// 使用 Pinia 状态管理
const pinia = createPinia()
app.use(pinia)

// 设置全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
}

// 注册全局属性
app.config.globalProperties.$material = {
  // Material Design 工具函数
  elevation: (level) => `md-elevation-${level}`,
  typography: (style) => `md-typography-${style}`,
  color: (name) => `rgb(var(--md-sys-color-${name}))`
}

// 挂载应用
app.mount('#app')
