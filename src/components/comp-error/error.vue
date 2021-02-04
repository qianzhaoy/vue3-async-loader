<template>
  <div class="customError" @click="onRetry">重试{{error.message}}</div>
</template>

<script>
export default {
  props: {
    error: Error,
    retry: Function
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