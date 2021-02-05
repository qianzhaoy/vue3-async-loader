<template>
  <div>我只会报错</div>
</template>

<script>
import { reactive } from 'vue'
function fetchData () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      reject('请求失败')
      // resolve(reactive({ username: '我的用户名' }))
    }, 1000)
  })
}
export default {
  async setup() {
    const res = await fetchData()
    return {
      res
    }
  }
}
</script>