<template>
  <div class="customError" @click="onRetry">重试{{errorMessage}}</div>
</template>

<script>
export default {
  props: {
    errorMessage: String,
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