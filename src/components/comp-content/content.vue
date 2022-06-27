<template>
  <div>
    <slot/>
    <br/>

    <div>
      父组件传进来的参数: {{title}}
    </div>
    <br/>

    <div>内部响应式状态: {{innerMsg}}</div>
    <br/>

    <el-button @click="handleClick">emit click</el-button>

    <el-divider></el-divider>
    <!-- 嵌套 -->
    <div>嵌套异步 setup 组件</div>
    <comp-fetch></comp-fetch>
  </div>
</template>
<script>
import { ref } from 'vue'
import compFetch from '../comp-fetch/fetch.vue'

export default {
  name: 'comp-content',
  emits: ['click'],
  components: {
    compFetch
  },
  props: {
    title: String
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  },
  setup(props, { expose }) {
    const innerMsg = ref('')

    function setMsg(msg) {
      console.log(msg);
      innerMsg.value = msg
    }
    expose({
      setMsg
    })
    return {
      innerMsg
    }
  }
}
</script>