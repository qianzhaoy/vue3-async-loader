<template>
  <div>
    <comp-fetch></comp-fetch>
    <div style="height: 200px; width: 200px">
      <comp-content ref="compContent" @resolve="handleResolve" @click="handleContentClick" :title="parentTitle">
        <div>this is child</div>
      </comp-content>
    </div>

    <!-- <Suspense 
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

import { asyncLoader, optionAsyncLoader } from './plugins/async-loader/index'
import { defineAsyncComponent, h } from 'vue'

// import compFetch from '~components/comp-fetch/fetch'
import Loading from '~components/comp-loading/loading'


function sleep(time) {
  if (!time) {
    return true
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

export default {
  name: 'App',
  data() {
    return {
      parentTitle: 'sdd'
    }
  },
  components: {
    compFetch: asyncLoader('comp-fetch/fetch'),
    compContent: asyncLoader('comp-content/content')
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
