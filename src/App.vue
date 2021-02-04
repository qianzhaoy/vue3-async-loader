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
    <div style="height: 200px; width: 200px">
      <comp-content/>
    </div>
  </div>
</template>

<script>

import compFetch from './components/comp-fetch/fetch'
import { asyncLoader } from './components/comp-async-load/index'

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
