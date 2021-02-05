import asyncPlugin, { asyncLoader } from './loader'
import compError from '~components/comp-error/error'
import { ElSkeleton } from 'element-plus'

export {asyncLoader}
export default function (app) {
  app.use(asyncPlugin, {
    errorComponent: compError,
    loadingComponent: ElSkeleton,
    minTime: 500,
    timeout: 2000
  })
}