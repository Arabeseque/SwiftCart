import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// [CONCEPT] 错误监控配置
// WARNING: 在生产环境中需要配置正确的DSN
Sentry.init({
  app,
  // NOTE: 在这里填写 Sentry 的地址
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://ae0c49f9b033a43dcb85e6b2029d7df0@o4508765522165760.ingest.us.sentry.io/4508765589667840",


});

// 使用持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.mount('#app')

