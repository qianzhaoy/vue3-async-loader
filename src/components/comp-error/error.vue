<template>
  <div class="customError">
    <el-empty :description="errorMessage">
      <el-button @click.stop="onRetry">点击重试</el-button>
    </el-empty>
  </div>
</template>

<script>
import { ElEmpty, ElButton } from 'element-plus'

export default {
  props: {
    error: Error,
    retry: Function
  },

  components: {
    [ElEmpty.name]: ElEmpty,
    [ElButton.name]: ElButton,
  },
  computed: {
    errorMessage() {
      return this.error.message
    }
  },
  methods: {
    onRetry() {
      if (this.retry) {
        this.retry()
      }
    }
  }
}
</script>