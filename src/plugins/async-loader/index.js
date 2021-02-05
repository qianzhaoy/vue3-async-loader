import asyncPlugin from './loader'
import compError from '~components/comp-error/error'
import { ElSkeleton } from 'element-plus'

export * from './loader'
export default function (app) {
  app.use(asyncPlugin, {
    errorComponent: compError,
    loadingComponent: ElSkeleton,
    minTime: 1500,
  })
}