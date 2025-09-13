import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'


import 'primeicons/primeicons.css' 
import 'primeflex/primeflex.css'   

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(PrimeVue, { theme: { preset: Aura } })

app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')