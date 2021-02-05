<template>
  <div style="height: 200px">{{ userInfo.username }}{{observed.title}}</div>
</template>

<script>
import { reactive, watch } from 'vue'
function fetchData () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(reactive({ username: '我的用户名' }))
    }, 0)
  })
}

export default {
  async setup() {
    const observed = reactive({
      title: 1
    })
    watch(() => observed.title, function() {
      // console.log('userInfo fetched')
    })

    setTimeout(function () {
      observed.title = 'xxx'
    }, 1000)
    const userInfo = await fetchData()
    // throw new Error('请求错误')
    return {
      observed,
      userInfo
    }
  }
}
</script>