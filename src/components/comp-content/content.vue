<template>
  <div>
    <slot/>
    <div @click="handleClick">
      {{title}}
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'

export default {
  name: 'comp-content',
  emits: ['click'],
  props: {
    title: String
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  },
  setup() {
    const observea = reactive({
      title: 11
    })
    return {
      observea
    }
  }
}
</script>