<template>
  <div>
    <div class="defult">
      <slot />
    </div>
    <div class="footer">
    <slot name='footer'/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Number
  },
}
</script>