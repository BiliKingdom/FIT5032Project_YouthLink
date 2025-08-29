// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

// main.ts / main.js
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// ✅ PrimeVue 相关
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// 如果要用 PrimeVue 的基础样式（建议加上）
import 'primeicons/primeicons.css'   // 图标
import 'primeflex/primeflex.css'     // 样式工具，可选

const app = createApp(App)

app.use(createPinia())
app.use(router)

// ✅ 注册 PrimeVue 并设置主题
app.use(PrimeVue, { theme: { preset: Aura } })

// ✅ 注册 DataTable 相关组件（全局可用）
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')

