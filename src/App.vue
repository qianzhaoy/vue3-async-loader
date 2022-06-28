<template>
  <div>
    <el-card header="Suspense一般用法">
      <Suspense @resolve="onResolve" @pending="onPending" @fallback="onFallback">
        <template #default>
          <compFetchCopy />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </el-card>

    <br />

    <el-card header="异步 setup 组件">
      <comp-fetch></comp-fetch>
    </el-card>

    <br />

    <el-card header="异步组件嵌套异步 setup 组件">
      <comp-content v-if="showcontent" ref="compContent" @resolve="onResolve" @click="handleContentClick" :title="parentTitle">
        <div>父组件传进来的插槽</div>
      </comp-content>

      <el-divider v-if="showcontent"></el-divider>

      <el-button @click="showcontent = true">加载组件</el-button>
      <el-button @click="setContentMsg">set msg by ref</el-button>
      <el-button @click="setParentTitle">set parentTitle</el-button>
    </el-card>

    <br />

    <el-card header="错误重试">
      <demo-error title="xxxx" @resolve="onResolve" @pending="onPending" @fallback="onFallback"></demo-error>
    </el-card>

  </div>
</template>

<script>
import { asyncLoader } from './plugins/async-loader/index'
import { defineAsyncComponent } from 'vue'

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
    compFetch: asyncLoader(() => import('~/components/comp-fetch/fetch')),
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
