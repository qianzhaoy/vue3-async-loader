<template>
  <div>{{ userInfo.username }}</div>
</template>

<script>
import { reactive } from 'vue'
function fetchData () {
  return new Promise((resolve,) => {
    setTimeout(function () {
      resolve(reactive({ username: '我的用户名' }))
    }, 2000)
  })
}

export default {
  async setup() {
    const userInfo = await fetchData()
    setTimeout(() => {
      userInfo.username = 'xxxx'
    }, 2000);
    // throw new Error('请求错误')
    return {
      userInfo
    }
  }
}
</script>