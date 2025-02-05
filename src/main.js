import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(piniaPersist); // 注册持久化插件


const app = createApp(App)
app.use(pinia)

app.mount('#app')


