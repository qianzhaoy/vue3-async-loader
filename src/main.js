import { createApp } from 'vue'
import App from './App.vue'

import installElementPlus from './plugins/element'
import asyncLoaderPlus from './plugins/async-loader/index'
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App)

app.use(installElementPlus)
app.use(asyncLoaderPlus)

app.mount('#app')
