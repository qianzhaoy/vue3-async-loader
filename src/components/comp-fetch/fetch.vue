<template>
  <div style="height: 200px">{{ userInfo.username }}</div>
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
    // throw new Error('请求错误')
    return {
      userInfo
    }
  }
}
</script>