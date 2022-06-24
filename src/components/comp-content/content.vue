<template>
  <div>
    <slot/>
    <div @click="handleClick">
      props title from parant: {{title}}
    </div>

    <div>inner reactive msg: {{innerMsg}}</div>

    <button type="button"  @click="handleClick">emit click</button>
    <!-- 嵌套 -->
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