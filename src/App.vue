<template>
  <div>
    <div style="height: 200px; width: 200px">
      <comp-fetch></comp-fetch>
    </div>
    <!-- <div style="height: 200px; width: 200px">
      <comp-content ref="compContent" @resolve="handleResolve" @click="handleContentClick" :title="parentTitle">
        <div>this is child</div>
      </comp-content>
    </div> -->

    <!-- <div style="height: 200px; width: 200px">
      <demo-error></demo-error>
    </div> -->
<!-- 
    <Suspense 
      :onResolve="onResolve"
      :onPending="onPending"
      :onFallback="onFallback"
      :timeout="1000"
    >
      <template #default>
        <comp-fetch/>      
      </template>
      <template #fallback>
        <div>Loading... (3 seconds)</div>   
      </template>
    </Suspense> -->
  </div>
</template>

<script>

import { asyncLoader } from './plugins/async-loader/index'

export default {
  name: 'App',
  data() {
    return {
      parentTitle: 'sdd',
      toggled: false
    }
  },
  components: {
    compFetch: asyncLoader('comp-fetch/fetch'),
    compContent: asyncLoader('comp-content/content'),
    demoError: asyncLoader('comp-demo-error/index'),
  },
  methods: {
    handleContentClick() {
      console.log('handleContentClick');
    },
    handleResolve() {
      console.log('onResolve-handleResolve');
    },
    onPending() {
      console.log('onPending');
    },
    onFallback() {
      console.log('onFallback');
    }
  },
}
</script>

<style>
</style>
