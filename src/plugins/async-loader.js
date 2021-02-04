import asyncPlugin from '~components/comp-async-load/index'
import compError from '~components/comp-error/error'
import compLoading from '~components/comp-loading/loading'
import { ElLoading, ElSkeleton } from 'element-plus'
import { h } from 'vue'

export default function (app) {
  app.use(asyncPlugin, {
    errorComponent: compError,
    loadingComponent: ElSkeleton,
    minTime: 2000
  })
}

console.log()