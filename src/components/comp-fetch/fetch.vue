<template>
  <div style="height: 200px">{{ userInfo.username }}</div>
</template>

<script>
import { reactive, watch } from 'vue'
function fetchData () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(reactive({ username: '我的用户名' }))
    },2500)
  })
}

export default {
  async setup() {
    const userInfo = await fetchData()
    return {
      userInfo
    }
  }
}
</script>