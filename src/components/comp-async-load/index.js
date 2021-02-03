import { h, Suspense, defineAsyncComponent, onErrorCaptured, ref, isVNode } from 'vue'
import loadingComp from '../comp-loading/loading'

const baseLoaderDefaultOptions = {
  minTime: 0,
  timeout: 0
}

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

function throwError(errMessage) {
  throw new Error(errMessage)
}

function createLoaderFunc(componentPath, options = baseLoaderDefaultOptions) {
  const { minTime, timeout } = options
  return async function importComponent() {
    let timer
    try {
      // TODO: 超时报错捕获
      if (timeout) {
        timer = setTimeout(() => {
          throwError(`load ${componentPath} timeout`)
        }, timeout);
      }
      const [ componentObject ] = await Promise.all([
        import(/* webpackChunkName: "[request]"*/ `~components/${componentPath}`),
        sleep(minTime)
      ])
      return componentObject
    } finally {
      clearTimeout(timer)
    }
  }
}

const asyncLoaderDefaultOptions = {
  createLoadingComponent: () => h(loadingComp),
  createErrorComponent: (errorMessage) => h('div', null, [errorMessage])
}

const globalOptions = {}
export function setAsyncLoaderOptions (options = {}) {
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      const value = options[key];
      globalOptions[key] = value     
    }
  }
}

function optionAsyncLoader(componentPath, options = {}) {
  return defineAsyncComponent({
    loader: createLoaderFunc(componentPath, {
      minTime: options.minTime,
      timeout: options.timeout
    }),
    loadingComponent: loadingComp,
    errorComponent: {
      render() {
        return h('div', null, ['error...'])
      }
    },
    onError(error, retry, fail, attempts) {
      const needRetry = typeof options.retry === 'function' && options.retry(error)
      if (needRetry && attempts <= options.attempts) {
        retry()
      } else {
        fail()
      }
    },
    ...options,
  })
}

export function asyncLoader (componentPath, options = {}) {
  const { createErrorComponent, createLoadingComponent, ...defineAsyncOptions } = { ...asyncLoaderDefaultOptions, ...globalOptions, ...options, }
  return {
    setup() {
      const error = ref(null)
      onErrorCaptured(setError)

      function setError(e) {
        error.value = e
        return true
      }

      function retry () {
        error.value = null
      }
      // return { error, retry }
      return (state) => {
        if (state.error) {
          const errorComponent = createErrorComponent(state.error.message, state.retry)
          if (isVNode(errorComponent)) {
            return errorComponent
          }
          return h(errorComponent)
        }

        const asyncomponent = typeof componentPath === 'object' ? componentPath : optionAsyncLoader(componentPath, defineAsyncOptions)
        return h(Suspense, null, {
          default: h(asyncomponent),
          fallback: createLoadingComponent()
        })
      }
    }
  }
}
