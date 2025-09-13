// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Bootstrap JS import
import * as bootstrap from 'bootstrap'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import 'primeicons/primeicons.css'   
import 'primeflex/primeflex.css'     

// Make Bootstrap available globally
;(window as any).bootstrap = bootstrap

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(PrimeVue, { theme: { preset: Aura } })

app.component('DataTable', DataTable)
app.component('Column', Column)

// Mount the app immediately
app.mount('#app')