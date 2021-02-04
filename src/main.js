import { createApp } from 'vue'
import App from './App.vue'

import compError from './components/comp-error/error'
import asyncPlugin from './components/comp-async-load/index'

const app = createApp(App)
app.use(asyncPlugin, {
  errorComponent: compError,
  minTime: 2000
})
app.mount('#app')
