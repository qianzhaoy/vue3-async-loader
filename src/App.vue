<template>
  <div>
    <h2>Suspense 一般用法</h2>
    <Suspense @resolve="onResolve" @pending="onPending" @fallback="onFallback">
      <template #default>
        <compFetchCopy ref="fetchCopy" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>

    <div>
      <h2>异步 setup 组件</h2>
      <comp-fetch :timeout="1000"></comp-fetch>
    </div>


    <h2>异步组件嵌套异步 setup 组件</h2>
    <div>
      <comp-content v-if="showcontent" ref="compContent" @resolve="onResolve" @click="handleContentClick" :title="parentTitle">
        <div>this is slot</div>
      </comp-content>
    </div>

    <button @click="showcontent = true">加载组件</button>
    <button @click="setContentMsg">set msg by ref</button>
    <button @click="setParentTitle">set parentTitle</button>


    <h2>错误重试</h2>
    <div>
      <demo-error title="xxxx" @resolve="onResolve" @pending="onPending" @fallback="onFallback"></demo-error>
    </div>

  </div>
</template>

<script>
import { asyncLoader } from './plugins/async-loader/index'
import { defineAsyncComponent, h } from 'vue'
// import compFetchCopy from './components/comp-fetch-copy/fetch.vue'

export default {
  name: 'App',
  data() {
    return {
      parentTitle: 'parentTitle',
      showcontent: false,
    }
  },
  components: {
    compFetchCopy: defineAsyncComponent(() => import(/* webpackChunkName: "fetch-copy"*/ './components/comp-fetch-copy/fetch.vue')),
    // compFetchCopy,  
    // compContent: defineAsyncComponent(() => import(/* webpackChunkName: "comp-content"*/ './components/comp-content/content.vue')),
    compFetch: asyncLoader('comp-fetch/fetch'),
    // compFetch: asyncLoader('comp-fetch/fetch', {
    //   loadingComponent: {
    //     render() {
    //       return h('div', null, 'loading')
    //     }
    //   }
    // }),
    compContent: asyncLoader('comp-content/content'),
    demoError: asyncLoader('comp-demo-error/index'),
  },
  methods: {
    setParentTitle() {
      this.parentTitle = this.parentTitle + "1"
    },
    setContentMsg() {
      this.$refs.compContent.setMsg('parent set child msg')
    },
    handleContentClick() {
      alert('click')
    },
    onResolve() {
      console.log('onResolve');
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
