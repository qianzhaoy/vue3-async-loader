<template>
  <div>我的用户名: {{ userInfo.username }}</div>
</template>

<script>
import { reactive, watch } from 'vue'
function fetchData () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(reactive({ username: 'zhaoyan.qian' }))
    }, 1000)
  })
}

export default {
  errorCaptured() {
    console.log('sdssdssdssds');
  },
  async setup(props) {
    const userInfo = await fetchData()
    return {
      userInfo
    }
  }
}
</script>