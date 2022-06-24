<script>
function fetchData () {
  return new Promise((resolve, reject) => {
    setTimeout( () => {
      reject('请求超时失败')
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