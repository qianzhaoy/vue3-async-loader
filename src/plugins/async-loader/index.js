import asyncPlugin from './loader'
import compError from '~components/comp-error/error'
import { ElSkeleton } from 'element-plus'

export * from './loader'
export default function (app) {
  app.use(asyncPlugin, {
    errorComponent: compError,
    loadingComponent: ElSkeleton,
    // delay: 500,
    timeout: 1000,
    shouldRetry: (error, attempts) => {
      console.log(error.message, attempts);
    },
    attempts: 1
  })
}