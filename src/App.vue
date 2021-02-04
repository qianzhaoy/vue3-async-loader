<template>
  <div>
    <comp-fetch></comp-fetch>
    <!-- <Suspense>
      <template #default>
        <comp-fetch/>      
      </template>
      <template #fallback>
        <div>Loading... (3 seconds)</div>   
      </template>
    </Suspense> -->
    <comp-content/>
  </div>
</template>

<script>

// import { compContent } from '~components/comp-content';
// console.log(compContent)
import compFetch from './components/comp-fetch/fetch'
import { asyncLoader } from './components/comp-async-load/index'


import { h } from 'vue'
import compError from './components/comp-error/error'
import { setAsyncLoaderOptions, optionAsyncLoader } from './components/comp-async-load/index'

// setAsyncLoaderOptions({
//   minTime: 2000,
//   errorComponent: compError
// })

export default {
  name: 'App',
  components: {
    compFetch: asyncLoader(compFetch),
    compContent: asyncLoader('comp-content/content')
  },
  created() {}
}
</script>

<style>
</style>
