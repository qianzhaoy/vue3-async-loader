import { h, Suspense, defineAsyncComponent, onErrorCaptured, ref } from 'vue'

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

function noop() {}

function createLoaderFunc(componentPath, options = baseLoaderDefaultOptions) {
  const { minTime, timeout, onComponentLoadStatus = noop } = options
  return function importComponent() {
    let timer
    if (timeout) {
      timer = setTimeout(() => {
        onComponentLoadStatus({
          error: new Error(`load ${componentPath} timeout`),
          loaded: false
        })
      }, timeout);
    }
    return Promise.all([
      import(/* webpackChunkName: "[request]"*/ `~components/${componentPath}`),
      sleep(minTime)
    ]).then(([componentObject]) => {
      onComponentLoadStatus({
        loaded: true
      })
      return componentObject
    }).finally(() => {
      clearTimeout(timer)
    })
  }
}

const asyncLoaderDefaultOptions = {
  loadingComponent: h('div', null, 'loading...'),
  errorComponent: {
    props: {
      error: Error
    },
    render({$props}) {
      return h('div', null, [$props.error.message])
    }
  }
}

const pluginOptions = {
  basePath: '~components'
}
function setAsyncLoaderOptions (options = {}) {
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      const value = options[key];
      pluginOptions[key] = value     
    }
  }
}

function optionAsyncLoader(componentPath, options = {}) {
  const { 
    errorComponent = asyncLoaderDefaultOptions.errorComponent, 
    loadingComponent = asyncLoaderDefaultOptions.loadingComponent
  } = options

  const { onComponentLoadStatus } = options
  return defineAsyncComponent({
    loader: createLoaderFunc(componentPath, {
      minTime: options.minTime,
      timeout: options.timeout,
      onComponentLoadStatus
    }),
    loadingComponent: loadingComponent,
    errorComponent: errorComponent,
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

function useComponentStatus() {
  const error = ref(null)
  const loaded = ref(false)

  function setError(e) {
    error.value = e
    return true
  }

  function retry () {
    loaded.value = false
    error.value = null
  }

  function setLoaded(value) {
    loaded.value = value
  }

  function setComponentLoadStatus({ loaded: loadedValue, error: errorValue }) {
    if (typeof loadedValue === 'boolean') {
      setLoaded(true)
    }
    if (errorValue instanceof Error) {
      setError(errorValue)
      setLoaded(false)
    }
  }

  onErrorCaptured(setError)

  return {
    error,
    retry,
    setComponentLoadStatus
  }
}


export function asyncLoader (componentPath, options = {}) {
  return {
    setup() {
      const { retry, error, setComponentLoadStatus } = useComponentStatus()

      const { errorComponent, loadingComponent, ...defineAsyncOptions } = { ...asyncLoaderDefaultOptions, ...pluginOptions, ...options, }
      defineAsyncOptions.onComponentLoadStatus = setComponentLoadStatus
      return () => {
        if (error.value) {
          return h(errorComponent, { error: error.value, retry })
        }

        const asyncomponent = typeof componentPath === 'object' ? componentPath : optionAsyncLoader(componentPath, defineAsyncOptions)
        return h(Suspense, null, {
          default: h(asyncomponent),
          fallback: loadingComponent
        })
      }
    }
  }
}

export default function install(app, options) {
  setAsyncLoaderOptions(options)
}